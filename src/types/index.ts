// Core type definitions for the AI Library Management System

export type UserRole = 'admin' | 'librarian' | 'student';

export type BookStatus = 'available' | 'borrowed' | 'reserved' | 'maintenance';

export type BorrowStatus = 'active' | 'returned' | 'overdue';

export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  student_id?: string;
  department?: string;
  reading_streak: number;
  total_books_read: number;
  favorite_categories: string[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  icon?: string;
  book_count: number;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  category_id: string;
  category?: Category;
  tags?: Tag[];
  cover_image_url?: string;
  file_url?: string;
  file_type?: 'pdf' | 'epub';
  published_year: number;
  language: string;
  pages: number;
  quantity: number;
  available_quantity: number;
  status: BookStatus;
  shelf_location?: string;
  average_rating: number;
  total_ratings: number;
  total_borrows: number;
  is_featured: boolean;
  is_trending: boolean;
  created_at: string;
  updated_at: string;
}

export interface BorrowRecord {
  id: string;
  user_id: string;
  book_id: string;
  book?: Book;
  user?: Profile;
  borrow_date: string;
  due_date: string;
  return_date?: string;
  status: BorrowStatus;
  fine_amount: number;
  is_renewed: boolean;
  renewal_count: number;
  created_at: string;
  updated_at: string;
}

export interface Fine {
  id: string;
  borrow_record_id: string;
  user_id: string;
  amount: number;
  is_paid: boolean;
  paid_date?: string;
  payment_method?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  book_id: string;
  user_id: string;
  user?: Profile;
  rating: number;
  comment?: string;
  is_verified_reader: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  book_id: string;
  page_number: number;
  note?: string;
  created_at: string;
}

export interface ReadingProgress {
  id: string;
  user_id: string;
  book_id: string;
  current_page: number;
  total_pages: number;
  progress_percentage: number;
  last_read_at: string;
  reading_time_minutes: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  book_id: string;
  book?: Book;
  created_at: string;
}

export interface Reservation {
  id: string;
  user_id: string;
  book_id: string;
  book?: Book;
  user?: Profile;
  status: 'pending' | 'fulfilled' | 'cancelled' | 'expired';
  reserved_at: string;
  expires_at: string;
  fulfilled_at?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface Recommendation {
  id: string;
  user_id: string;
  book_id: string;
  book?: Book;
  score: number;
  reason: string;
  algorithm: 'collaborative' | 'content_based' | 'hybrid' | 'trending';
  created_at: string;
}

export interface DashboardStats {
  total_users: number;
  total_books: number;
  total_borrowed: number;
  active_readers: number;
  overdue_books: number;
  total_revenue: number;
  new_users_this_month: number;
  books_added_this_month: number;
}

export interface ReadingStreak {
  current_streak: number;
  longest_streak: number;
  last_read_date: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  category: 'reading' | 'borrowing' | 'reviewing' | 'streak';
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  badge?: Badge;
  earned_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirm_password: string;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  description: string;
  category_id: string;
  tags: string[];
  published_year: number;
  language: string;
  pages: number;
  quantity: number;
  shelf_location?: string;
  cover_image?: File;
  book_file?: File;
}

export interface ProfileFormData {
  full_name: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  student_id?: string;
  department?: string;
  avatar?: File;
}

export interface ReviewFormData {
  rating: number;
  comment?: string;
}

// Filter and Search types
export interface BookFilters {
  category_id?: string;
  tags?: string[];
  language?: string;
  min_rating?: number;
  status?: BookStatus;
  is_featured?: boolean;
  is_trending?: boolean;
  search?: string;
}

export interface BorrowFilters {
  status?: BorrowStatus;
  user_id?: string;
  book_id?: string;
  is_overdue?: boolean;
}

// Chart data types
export interface ChartDataPoint {
  name: string;
  value: number;
  label?: string;
}

export interface TrendData {
  date: string;
  borrows: number;
  returns: number;
  new_users: number;
}
