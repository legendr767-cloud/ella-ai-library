import { supabase, STORAGE_BUCKETS, getPublicUrl } from '@/config/supabase';
import { safeFileName, sha256Hex, getPdfPageCount } from '@/utils/documents';
import { Book, BookFilters, PaginatedResponse } from '@/types';

export const bookService = {
  /**
   * Get all books with optional filters and pagination
   */
  async getBooks(
    filters?: BookFilters,
    page: number = 1,
    limit: number = 12
  ): Promise<PaginatedResponse<Book>> {
    let query = supabase
      .from('books')
      .select('*, category:categories(*), tags:book_tags(tag:tags(*))', { count: 'exact' });

    // Apply filters
    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    if (filters?.language) {
      query = query.eq('language', filters.language);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured);
    }

    if (filters?.is_trending !== undefined) {
      query = query.eq('is_trending', filters.is_trending);
    }

    if (filters?.min_rating) {
      query = query.gte('average_rating', filters.min_rating);
    }

    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,author.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      total_pages: Math.ceil((count || 0) / limit),
    };
  },

  /**
   * Get a single book by ID
   */
  async getBookById(id: string): Promise<Book> {
    const { data, error } = await supabase
      .from('books')
      .select('*, category:categories(*), tags:book_tags(tag:tags(*))')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create a new book
   */
  async createBook(book: Partial<Book>): Promise<Book> {
    const { data, error } = await supabase
      .from('books')
      .insert(book)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update a book
   */
  async updateBook(id: string, updates: Partial<Book>): Promise<Book> {
    const { data, error } = await supabase
      .from('books')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a book
   */
  async deleteBook(id: string): Promise<void> {
    // Remove the stored files first so nothing is orphaned in storage
    const { data: book } = await supabase
      .from('books')
      .select('file_path, cover_path')
      .eq('id', id)
      .single();

    if (book?.file_path) {
      await supabase.storage.from(STORAGE_BUCKETS.BOOK_FILES).remove([book.file_path]);
    }
    if (book?.cover_path) {
      await supabase.storage.from(STORAGE_BUCKETS.BOOK_COVERS).remove([book.cover_path]);
    }

    const { error } = await supabase.from('books').delete().eq('id', id);
    if (error) throw error;
  },

  /**
   * Upload a book document (and optional cover) then create the catalogue record.
   * Rolls the uploaded files back if the database insert fails.
   */
  async createBookWithFiles(
    meta: Partial<Book>,
    file: File,
    fileType: 'pdf' | 'epub',
    cover?: File | null
  ): Promise<Book> {
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth.user?.id;
    if (!uid) throw new Error('You must be signed in.');

    const stamp = Date.now();
    const filePath = `${uid}/${stamp}-${safeFileName(file.name)}`;
    const [sha, pageCount] = await Promise.all([
      sha256Hex(file),
      fileType === 'pdf' ? getPdfPageCount(file) : Promise.resolve(null),
    ]);

    const { error: upErr } = await supabase.storage
      .from(STORAGE_BUCKETS.BOOK_FILES)
      .upload(filePath, file, {
        contentType: fileType === 'pdf' ? 'application/pdf' : 'application/epub+zip',
        upsert: false,
      });
    if (upErr) throw upErr;

    let coverPath: string | null = null;
    let coverUrl: string | undefined;
    if (cover) {
      coverPath = `${uid}/${stamp}-${safeFileName(cover.name)}`;
      const { error: coverErr } = await supabase.storage
        .from(STORAGE_BUCKETS.BOOK_COVERS)
        .upload(coverPath, cover, { contentType: cover.type, upsert: false });
      if (coverErr) {
        await supabase.storage.from(STORAGE_BUCKETS.BOOK_FILES).remove([filePath]);
        throw coverErr;
      }
      coverUrl = getPublicUrl(STORAGE_BUCKETS.BOOK_COVERS, coverPath);
    }

    const { data, error } = await supabase
      .from('books')
      .insert({
        ...meta,
        file_path: filePath,
        file_type: fileType,
        file_size_bytes: file.size,
        file_sha256: sha,
        pages: pageCount ?? meta.pages,
        cover_path: coverPath,
        cover_image_url: coverUrl,
        uploaded_by: uid,
      })
      .select()
      .single();

    if (error) {
      await supabase.storage.from(STORAGE_BUCKETS.BOOK_FILES).remove([filePath]);
      if (coverPath) await supabase.storage.from(STORAGE_BUCKETS.BOOK_COVERS).remove([coverPath]);
      throw error;
    }
    return data;
  },

  /** Short-lived signed URL for reading the book in the browser. */
  async getReadUrl(book: Pick<Book, 'file_path'>, expiresInSeconds = 3600): Promise<string> {
    if (!book.file_path) throw new Error('This book has no digital file.');
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.BOOK_FILES)
      .createSignedUrl(book.file_path, expiresInSeconds);
    if (error || !data) throw error ?? new Error('Could not open the file.');
    return data.signedUrl;
  },

  /** Signed URL that forces a download with a friendly filename. */
  async getDownloadUrl(
    book: Pick<Book, 'id' | 'file_path' | 'title' | 'file_type'>
  ): Promise<string> {
    if (!book.file_path) throw new Error('This book has no digital file.');
    const filename = `${safeFileName(book.title)}.${book.file_type ?? 'pdf'}`;
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.BOOK_FILES)
      .createSignedUrl(book.file_path, 300, { download: filename });
    if (error || !data) throw error ?? new Error('Could not prepare the download.');
    await supabase.rpc('record_book_download', { p_book_id: book.id });
    return data.signedUrl;
  },

  /** Admin: mark a book as verified genuine (or remove the mark). */
  async setVerified(id: string, verified: boolean): Promise<void> {
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('books')
      .update({
        is_verified: verified,
        verified_at: verified ? new Date().toISOString() : null,
        verified_by: verified ? auth.user?.id ?? null : null,
      })
      .eq('id', id);
    if (error) throw error;
  },

  /**
   * Get featured books
   */
  async getFeaturedBooks(limit: number = 6): Promise<Book[]> {
    const { data, error } = await supabase
      .from('books')
      .select('*, category:categories(*)')
      .eq('is_featured', true)
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Get trending books
   */
  async getTrendingBooks(limit: number = 8): Promise<Book[]> {
    const { data, error } = await supabase
      .from('books')
      .select('*, category:categories(*)')
      .eq('is_trending', true)
      .eq('status', 'available')
      .order('total_borrows', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Get recently added books
   */
  async getRecentBooks(limit: number = 12): Promise<Book[]> {
    const { data, error } = await supabase
      .from('books')
      .select('*, category:categories(*)')
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Get popular books
   */
  async getPopularBooks(limit: number = 10): Promise<Book[]> {
    const { data, error } = await supabase
      .from('books')
      .select('*, category:categories(*)')
      .eq('status', 'available')
      .order('total_borrows', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Get highly rated books
   */
  async getHighlyRatedBooks(limit: number = 10): Promise<Book[]> {
    const { data, error } = await supabase
      .from('books')
      .select('*, category:categories(*)')
      .eq('status', 'available')
      .gte('average_rating', 4.0)
      .order('average_rating', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Search books
   */
  async searchBooks(query: string, limit: number = 20): Promise<Book[]> {
    const { data, error } = await supabase
      .from('books')
      .select('*, category:categories(*)')
      .or(`title.ilike.%${query}%,author.ilike.%${query}%,description.ilike.%${query}%`)
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Get books by category
   */
  async getBooksByCategory(categoryId: string, limit: number = 12): Promise<Book[]> {
    const { data, error } = await supabase
      .from('books')
      .select('*, category:categories(*)')
      .eq('category_id', categoryId)
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Update book availability
   */
  async updateAvailability(id: string, quantity: number): Promise<void> {
    const { error } = await supabase
      .from('books')
      .update({ available_quantity: quantity })
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Increment borrow count
   */
  async incrementBorrowCount(id: string): Promise<void> {
    const { data: book } = await supabase
      .from('books')
      .select('total_borrows')
      .eq('id', id)
      .single();

    if (book) {
      await supabase
        .from('books')
        .update({ total_borrows: book.total_borrows + 1 })
        .eq('id', id);
    }
  },
};
