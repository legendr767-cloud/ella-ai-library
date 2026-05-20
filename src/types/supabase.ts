// Supabase database types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          avatar_url: string | null
          phone: string | null
          address: string | null
          date_of_birth: string | null
          student_id: string | null
          department: string | null
          reading_streak: number
          total_books_read: number
          favorite_categories: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          date_of_birth?: string | null
          student_id?: string | null
          department?: string | null
          reading_streak?: number
          total_books_read?: number
          favorite_categories?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          date_of_birth?: string | null
          student_id?: string | null
          department?: string | null
          reading_streak?: number
          total_books_read?: number
          favorite_categories?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          slug: string
          icon: string | null
          book_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          slug: string
          icon?: string | null
          book_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          slug?: string
          icon?: string | null
          book_count?: number
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      books: {
        Row: {
          id: string
          title: string
          author: string
          isbn: string
          description: string
          category_id: string
          cover_image_url: string | null
          file_url: string | null
          file_type: string | null
          published_year: number
          language: string
          pages: number
          quantity: number
          available_quantity: number
          status: string
          shelf_location: string | null
          average_rating: number
          total_ratings: number
          total_borrows: number
          is_featured: boolean
          is_trending: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          isbn: string
          description: string
          category_id: string
          cover_image_url?: string | null
          file_url?: string | null
          file_type?: string | null
          published_year: number
          language: string
          pages: number
          quantity: number
          available_quantity?: number
          status?: string
          shelf_location?: string | null
          average_rating?: number
          total_ratings?: number
          total_borrows?: number
          is_featured?: boolean
          is_trending?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          isbn?: string
          description?: string
          category_id?: string
          cover_image_url?: string | null
          file_url?: string | null
          file_type?: string | null
          published_year?: number
          language?: string
          pages?: number
          quantity?: number
          available_quantity?: number
          status?: string
          shelf_location?: string | null
          average_rating?: number
          total_ratings?: number
          total_borrows?: number
          is_featured?: boolean
          is_trending?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      borrow_records: {
        Row: {
          id: string
          user_id: string
          book_id: string
          borrow_date: string
          due_date: string
          return_date: string | null
          status: string
          fine_amount: number
          is_renewed: boolean
          renewal_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          borrow_date?: string
          due_date: string
          return_date?: string | null
          status?: string
          fine_amount?: number
          is_renewed?: boolean
          renewal_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          borrow_date?: string
          due_date?: string
          return_date?: string | null
          status?: string
          fine_amount?: number
          is_renewed?: boolean
          renewal_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          book_id: string
          user_id: string
          rating: number
          comment: string | null
          is_verified_reader: boolean
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          user_id: string
          rating: number
          comment?: string | null
          is_verified_reader?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          is_verified_reader?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          book_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          created_at?: string
        }
      }
      reading_progress: {
        Row: {
          id: string
          user_id: string
          book_id: string
          current_page: number
          total_pages: number
          progress_percentage: number
          last_read_at: string
          reading_time_minutes: number
          is_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          current_page?: number
          total_pages: number
          progress_percentage?: number
          last_read_at?: string
          reading_time_minutes?: number
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          current_page?: number
          total_pages?: number
          progress_percentage?: number
          last_read_at?: string
          reading_time_minutes?: number
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          is_read: boolean
          action_url: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          is_read?: boolean
          action_url?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          is_read?: boolean
          action_url?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'librarian' | 'student'
      book_status: 'available' | 'borrowed' | 'reserved' | 'maintenance'
      borrow_status: 'active' | 'returned' | 'overdue'
    }
  }
}
