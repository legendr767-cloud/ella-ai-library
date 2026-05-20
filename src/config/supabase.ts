import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isDemoMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase');
const effectiveUrl = isDemoMode ? 'https://placeholder.supabase.co' : supabaseUrl;
const effectiveKey = isDemoMode ? 'placeholder-anon-key' : supabaseAnonKey;

export const supabase = createClient<Database>(effectiveUrl, effectiveKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Storage bucket names
export const STORAGE_BUCKETS = {
  BOOK_COVERS: 'book-covers',
  BOOK_FILES: 'book-files',
  AVATARS: 'avatars',
} as const;

// Helper function to get public URL for storage files
export const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

// Helper function to upload file
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string; error: Error | null }> => {
  try {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const url = getPublicUrl(bucket, path);
    return { url, error: null };
  } catch (error) {
    return { url: '', error: error as Error };
  }
};

// Helper function to delete file
export const deleteFile = async (
  bucket: string,
  path: string
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
};
