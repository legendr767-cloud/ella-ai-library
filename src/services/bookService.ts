import { supabase } from '@/config/supabase';
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
    const { error } = await supabase.from('books').delete().eq('id', id);
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
