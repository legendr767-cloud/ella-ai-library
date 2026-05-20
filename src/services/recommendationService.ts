import { supabase } from '@/config/supabase';
import { Book, Recommendation } from '@/types';
import { RECOMMENDATION_COUNT } from '@/config/constants';

export const recommendationService = {
  /**
   * Get personalized recommendations for a user
   */
  async getRecommendations(userId: string, limit: number = RECOMMENDATION_COUNT): Promise<Book[]> {
    // Get user's reading history
    const { data: borrowHistory } = await supabase
      .from('borrow_records')
      .select('book_id, book:books(category_id)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    // Get user's favorite categories
    const { data: profile } = await supabase
      .from('profiles')
      .select('favorite_categories')
      .eq('user_id', userId)
      .single();

    const favoriteCategories = profile?.favorite_categories || [];
    const readBookIds = borrowHistory?.map((record) => record.book_id) || [];

    // Get recommendations based on favorite categories
    let query = supabase
      .from('books')
      .select('*, category:categories(*)')
      .eq('status', 'available')
      .not('id', 'in', `(${readBookIds.join(',') || 'null'})`);

    if (favoriteCategories.length > 0) {
      query = query.in('category_id', favoriteCategories);
    }

    const { data, error } = await query
      .order('average_rating', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Get similar books based on a book
   */
  async getSimilarBooks(bookId: string, limit: number = 6): Promise<Book[]> {
    // Get the source book
    const { data: sourceBook } = await supabase
      .from('books')
      .select('category_id, author')
      .eq('id', bookId)
      .single();

    if (!sourceBook) return [];

    // Get books from same category or by same author
    const { data, error } = await supabase
      .from('books')
      .select('*, category:categories(*)')
      .eq('status', 'available')
      .neq('id', bookId)
      .or(`category_id.eq.${sourceBook.category_id},author.ilike.%${sourceBook.author}%`)
      .order('average_rating', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Get trending books in user's favorite categories
   */
  async getTrendingInCategories(userId: string, limit: number = 8): Promise<Book[]> {
    const { data: profile } = await supabase
      .from('profiles')
      .select('favorite_categories')
      .eq('user_id', userId)
      .single();

    const favoriteCategories = profile?.favorite_categories || [];

    let query = supabase
      .from('books')
      .select('*, category:categories(*)')
      .eq('status', 'available')
      .eq('is_trending', true);

    if (favoriteCategories.length > 0) {
      query = query.in('category_id', favoriteCategories);
    }

    const { data, error } = await query
      .order('total_borrows', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Get "Because you read" recommendations
   */
  async getBecauseYouRead(userId: string, limit: number = 6): Promise<Book[]> {
    // Get user's most recent read
    const { data: recentBorrow } = await supabase
      .from('borrow_records')
      .select('book_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!recentBorrow) return [];

    return this.getSimilarBooks(recentBorrow.book_id, limit);
  },

  /**
   * Collaborative filtering - books read by users with similar taste
   */
  async getCollaborativeRecommendations(userId: string, limit: number = 10): Promise<Book[]> {
    // Get books the user has read
    const { data: userBooks } = await supabase
      .from('borrow_records')
      .select('book_id')
      .eq('user_id', userId);

    const userBookIds = userBooks?.map((record) => record.book_id) || [];

    if (userBookIds.length === 0) return [];

    // Find users who read similar books
    const { data: similarUsers } = await supabase
      .from('borrow_records')
      .select('user_id')
      .in('book_id', userBookIds)
      .neq('user_id', userId);

    const similarUserIds = [...new Set(similarUsers?.map((record) => record.user_id) || [])];

    if (similarUserIds.length === 0) return [];

    // Get books read by similar users that current user hasn't read
    const { data: recommendations } = await supabase
      .from('borrow_records')
      .select('book_id, book:books(*, category:categories(*))')
      .in('user_id', similarUserIds)
      .not('book_id', 'in', `(${userBookIds.join(',')})`)
      .limit(limit);

    if (!recommendations) return [];

    // Extract unique books
    const uniqueBooks = new Map();
    recommendations.forEach((record: any) => {
      if (record.book && !uniqueBooks.has(record.book.id)) {
        uniqueBooks.set(record.book.id, record.book);
      }
    });

    return Array.from(uniqueBooks.values()).slice(0, limit);
  },

  /**
   * Content-based filtering using book metadata
   */
  async getContentBasedRecommendations(userId: string, limit: number = 10): Promise<Book[]> {
    // Get user's highly rated books
    const { data: reviews } = await supabase
      .from('reviews')
      .select('book_id, book:books(category_id, author)')
      .eq('user_id', userId)
      .gte('rating', 4)
      .order('rating', { ascending: false })
      .limit(5);

    if (!reviews || reviews.length === 0) return [];

    // Extract categories and authors
    const categories = new Set<string>();
    const authors = new Set<string>();

    reviews.forEach((review: any) => {
      if (review.book) {
        categories.add(review.book.category_id);
        authors.add(review.book.author);
      }
    });

    // Get books matching these preferences
    const { data, error } = await supabase
      .from('books')
      .select('*, category:categories(*)')
      .eq('status', 'available')
      .or(
        `category_id.in.(${Array.from(categories).join(',')}),author.in.(${Array.from(authors).join(',')})`
      )
      .order('average_rating', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  /**
   * Hybrid recommendation combining multiple algorithms
   */
  async getHybridRecommendations(userId: string, limit: number = 12): Promise<Book[]> {
    const [
      collaborative,
      contentBased,
      trending,
      personalized,
    ] = await Promise.all([
      this.getCollaborativeRecommendations(userId, 3),
      this.getContentBasedRecommendations(userId, 3),
      this.getTrendingInCategories(userId, 3),
      this.getRecommendations(userId, 3),
    ]);

    // Combine and deduplicate
    const allRecommendations = [
      ...collaborative,
      ...contentBased,
      ...trending,
      ...personalized,
    ];

    const uniqueBooks = new Map();
    allRecommendations.forEach((book) => {
      if (!uniqueBooks.has(book.id)) {
        uniqueBooks.set(book.id, book);
      }
    });

    return Array.from(uniqueBooks.values()).slice(0, limit);
  },

  /**
   * Save recommendation to database
   */
  async saveRecommendation(
    userId: string,
    bookId: string,
    score: number,
    reason: string,
    algorithm: 'collaborative' | 'content_based' | 'hybrid' | 'trending'
  ): Promise<void> {
    await supabase.from('recommendations').insert({
      user_id: userId,
      book_id: bookId,
      score,
      reason,
      algorithm,
    });
  },

  /**
   * Get saved recommendations
   */
  async getSavedRecommendations(userId: string, limit: number = 20): Promise<Recommendation[]> {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*, book:books(*, category:categories(*))')
      .eq('user_id', userId)
      .order('score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },
};
