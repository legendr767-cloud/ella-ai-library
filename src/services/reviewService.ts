import { supabase } from '@/config/supabase';
import { Review, PaginatedResponse } from '@/types';

export const reviewService = {
  /**
   * Get reviews for a book
   */
  async getBookReviews(
    bookId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Review>> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('reviews')
      .select('*, user:profiles(*)', { count: 'exact' })
      .eq('book_id', bookId)
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
   * Get user's reviews
   */
  async getUserReviews(userId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, book:books(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Create a review
   */
  async createReview(review: Partial<Review>): Promise<Review> {
    // Check if user has already reviewed this book
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('book_id', review.book_id!)
      .eq('user_id', review.user_id!)
      .single();

    if (existing) {
      throw new Error('You have already reviewed this book');
    }

    // Check if user has borrowed this book
    const { data: borrowRecord } = await supabase
      .from('borrow_records')
      .select('id')
      .eq('book_id', review.book_id!)
      .eq('user_id', review.user_id!)
      .single();

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        ...review,
        is_verified_reader: !!borrowRecord,
        helpful_count: 0,
      })
      .select('*, user:profiles(*)')
      .single();

    if (error) throw error;

    // Update book rating
    await this.updateBookRating(review.book_id!);

    return data;
  },

  /**
   * Update a review
   */
  async updateReview(id: string, updates: Partial<Review>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select('*, user:profiles(*)')
      .single();

    if (error) throw error;

    // Update book rating if rating changed
    if (updates.rating !== undefined) {
      const { data: review } = await supabase
        .from('reviews')
        .select('book_id')
        .eq('id', id)
        .single();

      if (review) {
        await this.updateBookRating(review.book_id);
      }
    }

    return data;
  },

  /**
   * Delete a review
   */
  async deleteReview(id: string): Promise<void> {
    const { data: review } = await supabase
      .from('reviews')
      .select('book_id')
      .eq('id', id)
      .single();

    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) throw error;

    // Update book rating
    if (review) {
      await this.updateBookRating(review.book_id);
    }
  },

  /**
   * Mark review as helpful
   */
  async markHelpful(id: string): Promise<void> {
    const { data: review } = await supabase
      .from('reviews')
      .select('helpful_count')
      .eq('id', id)
      .single();

    if (review) {
      await supabase
        .from('reviews')
        .update({ helpful_count: review.helpful_count + 1 })
        .eq('id', id);
    }
  },

  /**
   * Update book's average rating
   */
  async updateBookRating(bookId: string): Promise<void> {
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('book_id', bookId);

    if (!reviews || reviews.length === 0) {
      await supabase
        .from('books')
        .update({ average_rating: 0, total_ratings: 0 })
        .eq('id', bookId);
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await supabase
      .from('books')
      .update({
        average_rating: Math.round(averageRating * 10) / 10,
        total_ratings: reviews.length,
      })
      .eq('id', bookId);
  },

  /**
   * Get verified reviews
   */
  async getVerifiedReviews(bookId: string, limit: number = 5): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, user:profiles(*)')
      .eq('book_id', bookId)
      .eq('is_verified_reader', true)
      .order('helpful_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },
};
