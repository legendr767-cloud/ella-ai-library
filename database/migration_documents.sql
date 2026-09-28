-- =====================================================================
-- Ella's Library — Document management migration
-- Run once in Supabase Dashboard > SQL Editor (safe to re-run).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Secure roles: store role in profiles (NOT in user-editable metadata)
-- ---------------------------------------------------------------------
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'student';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN NOT NULL DEFAULT FALSE;

-- Migrate any role previously kept in auth metadata
UPDATE profiles p
SET role = (u.raw_user_meta_data->>'role')::user_role
FROM auth.users u
WHERE u.id = p.user_id
  AND u.raw_user_meta_data->>'role' IN ('admin', 'librarian', 'student')
  AND p.role = 'student';

-- Helper used by every policy below
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'librarian')
      AND is_suspended = FALSE
  );
$$;

-- New sign-ups always become 'student', whatever the client sends
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'student'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Nobody may change their own role / suspension (only an existing admin can)
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (NEW.role IS DISTINCT FROM OLD.role OR NEW.is_suspended IS DISTINCT FROM OLD.is_suspended)
     AND auth.uid() IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Only an admin can change roles or suspend accounts';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_role_trigger ON profiles;
CREATE TRIGGER protect_profile_role_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();

-- ---------------------------------------------------------------------
-- 2. Book file + authenticity metadata
-- ---------------------------------------------------------------------
ALTER TABLE books ADD COLUMN IF NOT EXISTS file_path TEXT;            -- path inside 'book-files' bucket
ALTER TABLE books ADD COLUMN IF NOT EXISTS cover_path TEXT;           -- path inside 'book-covers' bucket
ALTER TABLE books ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS file_sha256 VARCHAR(64);   -- integrity fingerprint of the uploaded file
ALTER TABLE books ADD COLUMN IF NOT EXISTS publisher VARCHAR(255);
ALTER TABLE books ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE books ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE books ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE books ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE books ADD COLUMN IF NOT EXISTS download_count INTEGER NOT NULL DEFAULT 0;

-- ISBN must be 10 or 13 digits (the original column was VARCHAR(13) — hyphens are stripped by the app)
ALTER TABLE books DROP CONSTRAINT IF EXISTS valid_isbn_format;
ALTER TABLE books ADD CONSTRAINT valid_isbn_format CHECK (isbn ~ '^[0-9]{9}[0-9Xx]$' OR isbn ~ '^[0-9]{13}$');

-- Only staff may write to books; everyone signed in may read
DROP POLICY IF EXISTS "Anyone can view books" ON books;
DROP POLICY IF EXISTS "Admins and librarians can manage books" ON books;
CREATE POLICY "Anyone can view books" ON books FOR SELECT USING (true);
CREATE POLICY "Staff can insert books" ON books FOR INSERT WITH CHECK (public.is_staff());
CREATE POLICY "Staff can update books" ON books FOR UPDATE USING (public.is_staff()) WITH CHECK (public.is_staff());
CREATE POLICY "Staff can delete books" ON books FOR DELETE USING (public.is_staff());

-- Same fix for other admin-only policies that trusted user metadata
DROP POLICY IF EXISTS "Only admins can manage categories" ON categories;
CREATE POLICY "Staff can manage categories" ON categories FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "Admins can view all borrow records" ON borrow_records;
DROP POLICY IF EXISTS "Admins can manage borrow records" ON borrow_records;
CREATE POLICY "Staff can manage borrow records" ON borrow_records FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

-- Counts a download without letting clients edit the books table
CREATE OR REPLACE FUNCTION public.record_book_download(p_book_id UUID)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE books SET download_count = download_count + 1 WHERE id = p_book_id AND auth.uid() IS NOT NULL;
$$;

-- ---------------------------------------------------------------------
-- 3. Storage buckets
--    book-files : PRIVATE — only signed-in users can read (via signed URLs)
--    book-covers: public images
-- ---------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('book-files', 'book-files', FALSE, 52428800, ARRAY['application/pdf', 'application/epub+zip'])
ON CONFLICT (id) DO UPDATE
  SET public = FALSE, file_size_limit = 52428800,
      allowed_mime_types = ARRAY['application/pdf', 'application/epub+zip'];

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('book-covers', 'book-covers', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE
  SET public = TRUE, file_size_limit = 5242880,
      allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- book-files policies
DROP POLICY IF EXISTS "Signed-in users can read book files" ON storage.objects;
DROP POLICY IF EXISTS "Staff can upload book files" ON storage.objects;
DROP POLICY IF EXISTS "Staff can update book files" ON storage.objects;
DROP POLICY IF EXISTS "Staff can delete book files" ON storage.objects;

CREATE POLICY "Signed-in users can read book files" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'book-files');
CREATE POLICY "Staff can upload book files" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'book-files' AND public.is_staff());
CREATE POLICY "Staff can update book files" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'book-files' AND public.is_staff());
CREATE POLICY "Staff can delete book files" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'book-files' AND public.is_staff());

-- book-covers policies
DROP POLICY IF EXISTS "Anyone can view covers" ON storage.objects;
DROP POLICY IF EXISTS "Staff can upload covers" ON storage.objects;
DROP POLICY IF EXISTS "Staff can update covers" ON storage.objects;
DROP POLICY IF EXISTS "Staff can delete covers" ON storage.objects;

CREATE POLICY "Anyone can view covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'book-covers');
CREATE POLICY "Staff can upload covers" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'book-covers' AND public.is_staff());
CREATE POLICY "Staff can update covers" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'book-covers' AND public.is_staff());
CREATE POLICY "Staff can delete covers" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'book-covers' AND public.is_staff());

-- ---------------------------------------------------------------------
-- 4. Make yourself the first admin (replace the email, then run once)
-- ---------------------------------------------------------------------
-- UPDATE profiles SET role = 'admin'
-- WHERE user_id = (SELECT id FROM auth.users WHERE email = 'you@example.com');
