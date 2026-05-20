import { supabase } from '@/config/supabase';
import { BorrowRecord, BorrowFilters, PaginatedResponse } from '@/types';
import { DEFAULT_BORROW_DAYS, FINE_PER_DAY, MAX_BORROW_LIMIT } from '@/config/constants';
import { addDaysToDate, calculateFine, isOverdue } from '@/utils/helpers';

export const borrowService = {
  /**
   * Get borrow records with filters and pagination
   */
  async getBorrowRecords(
    filters?: BorrowFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<BorrowRecord>> {
    let query = supabase
      .from('borrow_records')
      .select('*, book:books(*), user:profiles(*)', { count: 'exact' });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id);
    }

    if (filters?.book_id) {
      query = query.eq('book_id', filters.book_id);
    }

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
   * Get user's active borrows
   */
  async getUserActiveBorrows(userId: string): Promise<BorrowRecord[]> {
    const { data, error } = await supabase
      .from('borrow_records')
      .select('*, book:books(*)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get user's borrow history
   */
  async getUserBorrowHistory(userId: string): Promise<BorrowRecord[]> {
    const { data, error } = await supabase
      .from('borrow_records')
      .select('*, book:books(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Check if user can borrow more books
   */
  async canUserBorrow(userId: string): Promise<{ canBorrow: boolean; reason?: string }> {
    const activeBorrows = await this.getUserActiveBorrows(userId);

    if (activeBorrows.length >= MAX_BORROW_LIMIT) {
      return {
        canBorrow: false,
        reason: `You have reached the maximum borrow limit of ${MAX_BORROW_LIMIT} books`,
      };
    }

    // Check for overdue books
    const overdueBooks = activeBorrows.filter((record) => isOverdue(record.due_date));
    if (overdueBooks.length > 0) {
      return {
        canBorrow: false,
        reason: 'You have overdue books. Please return them before borrowing more.',
      };
    }

    return { canBorrow: true };
  },

  /**
   * Borrow a book
   */
  async borrowBook(userId: string, bookId: string): Promise<BorrowRecord> {
    // Check if user can borrow
    const { canBorrow, reason } = await this.canUserBorrow(userId);
    if (!canBorrow) {
      throw new Error(reason);
    }

    // Check book availability
    const { data: book } = await supabase
      .from('books')
      .select('available_quantity')
      .eq('id', bookId)
      .single();

    if (!book || book.available_quantity <= 0) {
      throw new Error('Book is not available');
    }

    const borrowDate = new Date();
    const dueDate = addDaysToDate(borrowDate, DEFAULT_BORROW_DAYS);

    // Create borrow record
    const { data, error } = await supabase
      .from('borrow_records')
      .insert({
        user_id: userId,
        book_id: bookId,
        borrow_date: borrowDate.toISOString(),
        due_date: dueDate.toISOString(),
        status: 'active',
        fine_amount: 0,
        is_renewed: false,
        renewal_count: 0,
      })
      .select('*, book:books(*)')
      .single();

    if (error) throw error;

    // Update book availability
    await supabase
      .from('books')
      .update({ available_quantity: book.available_quantity - 1 })
      .eq('id', bookId);

    // Increment borrow count
    const { data: bookData } = await supabase
      .from('books')
      .select('total_borrows')
      .eq('id', bookId)
      .single();

    if (bookData) {
      await supabase
        .from('books')
        .update({ total_borrows: bookData.total_borrows + 1 })
        .eq('id', bookId);
    }

    return data;
  },

  /**
   * Return a book
   */
  async returnBook(borrowId: string): Promise<BorrowRecord> {
    const { data: record } = await supabase
      .from('borrow_records')
      .select('*, book:books(*)')
      .eq('id', borrowId)
      .single();

    if (!record) {
      throw new Error('Borrow record not found');
    }

    const returnDate = new Date();
    const fine = isOverdue(record.due_date) ? calculateFine(record.due_date, FINE_PER_DAY) : 0;

    // Update borrow record
    const { data, error } = await supabase
      .from('borrow_records')
      .update({
        return_date: returnDate.toISOString(),
        status: 'returned',
        fine_amount: fine,
      })
      .eq('id', borrowId)
      .select('*, book:books(*)')
      .single();

    if (error) throw error;

    // Update book availability
    const { data: book } = await supabase
      .from('books')
      .select('available_quantity')
      .eq('id', record.book_id)
      .single();

    if (book) {
      await supabase
        .from('books')
        .update({ available_quantity: book.available_quantity + 1 })
        .eq('id', record.book_id);
    }

    // Create fine record if applicable
    if (fine > 0) {
      await supabase.from('fines').insert({
        borrow_record_id: borrowId,
        user_id: record.user_id,
        amount: fine,
        is_paid: false,
      });
    }

    return data;
  },

  /**
   * Renew a borrowed book
   */
  async renewBook(borrowId: string): Promise<BorrowRecord> {
    const { data: record } = await supabase
      .from('borrow_records')
      .select('*')
      .eq('id', borrowId)
      .single();

    if (!record) {
      throw new Error('Borrow record not found');
    }

    if (record.renewal_count >= 2) {
      throw new Error('Maximum renewal limit reached');
    }

    const newDueDate = addDaysToDate(record.due_date, DEFAULT_BORROW_DAYS);

    const { data, error } = await supabase
      .from('borrow_records')
      .update({
        due_date: newDueDate.toISOString(),
        is_renewed: true,
        renewal_count: record.renewal_count + 1,
      })
      .eq('id', borrowId)
      .select('*, book:books(*)')
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get overdue books
   */
  async getOverdueBooks(): Promise<BorrowRecord[]> {
    const today = new Date().toISOString();

    const { data, error } = await supabase
      .from('borrow_records')
      .select('*, book:books(*), user:profiles(*)')
      .eq('status', 'active')
      .lt('due_date', today)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Update overdue statuses
   */
  async updateOverdueStatuses(): Promise<void> {
    const overdueBooks = await this.getOverdueBooks();

    for (const record of overdueBooks) {
      await supabase
        .from('borrow_records')
        .update({ status: 'overdue' })
        .eq('id', record.id);
    }
  },

  /**
   * Get borrow statistics
   */
  async getBorrowStats(): Promise<{
    total: number;
    active: number;
    overdue: number;
    returned: number;
  }> {
    const { count: total } = await supabase
      .from('borrow_records')
      .select('*', { count: 'exact', head: true });

    const { count: active } = await supabase
      .from('borrow_records')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: overdue } = await supabase
      .from('borrow_records')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'overdue');

    const { count: returned } = await supabase
      .from('borrow_records')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'returned');

    return {
      total: total || 0,
      active: active || 0,
      overdue: overdue || 0,
      returned: returned || 0,
    };
  },
};
