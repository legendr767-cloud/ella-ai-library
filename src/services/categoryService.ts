import { supabase } from '@/config/supabase';
import { Category } from '@/types';

export const categoryService = {
  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create category
   */
  async createCategory(category: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update category
   */
  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete category
   */
  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  },

  /**
   * Get popular categories
   */
  async getPopularCategories(limit: number = 6): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('book_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },
};
