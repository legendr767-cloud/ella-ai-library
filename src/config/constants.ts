// Application constants

export const APP_NAME = import.meta.env.VITE_APP_NAME || "Ella's Library";
export const APP_URL = import.meta.env.VITE_APP_URL || 'http://localhost:3000';

// Borrowing configuration
export const MAX_BORROW_LIMIT = parseInt(import.meta.env.VITE_MAX_BORROW_LIMIT || '5');
export const DEFAULT_BORROW_DAYS = parseInt(import.meta.env.VITE_DEFAULT_BORROW_DAYS || '14');
export const FINE_PER_DAY = parseFloat(import.meta.env.VITE_FINE_PER_DAY || '0.50');
export const MAX_RENEWAL_COUNT = 2;

// File upload configuration
export const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '10485760'); // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
export const ALLOWED_BOOK_TYPES = ['application/pdf', 'application/epub+zip'];

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const BOOKS_PER_PAGE = 12;
export const REVIEWS_PER_PAGE = 10;
export const NOTIFICATIONS_PER_PAGE = 20;

// Search
export const SEARCH_DEBOUNCE_MS = 300;
export const MIN_SEARCH_LENGTH = 2;

// Reading
export const READING_SESSION_TIMEOUT = 30; // minutes
export const BOOKMARK_AUTO_SAVE_INTERVAL = 60000; // 1 minute

// Notifications
export const NOTIFICATION_DURATION = 5000; // 5 seconds
export const MAX_NOTIFICATIONS = 50;

// AI Recommendations
export const RECOMMENDATION_COUNT = 10;
export const SIMILAR_BOOKS_COUNT = 6;
export const TRENDING_BOOKS_COUNT = 8;

// Cache durations (in milliseconds)
export const CACHE_DURATION = {
  BOOKS: 5 * 60 * 1000, // 5 minutes
  CATEGORIES: 30 * 60 * 1000, // 30 minutes
  PROFILE: 10 * 60 * 1000, // 10 minutes
  STATS: 2 * 60 * 1000, // 2 minutes
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  BOOKS: '/books',
  BOOK_DETAILS: '/books/:id',
  READER: '/reader/:id',
  MY_BOOKS: '/my-books',
  FAVORITES: '/favorites',
  HISTORY: '/history',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  ADMIN: '/admin',
  ADMIN_BOOKS: '/admin/books',
  ADMIN_USERS: '/admin/users',
  ADMIN_BORROWS: '/admin/borrows',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  LIBRARIAN: 'librarian',
  STUDENT: 'student',
} as const;

// Book statuses
export const BOOK_STATUSES = {
  AVAILABLE: 'available',
  BORROWED: 'borrowed',
  RESERVED: 'reserved',
  MAINTENANCE: 'maintenance',
} as const;

// Borrow statuses
export const BORROW_STATUSES = {
  ACTIVE: 'active',
  RETURNED: 'returned',
  OVERDUE: 'overdue',
} as const;

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

// Languages
export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ar', label: 'Arabic' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
];

// Badge requirements
export const BADGE_REQUIREMENTS = {
  FIRST_BOOK: 1,
  BOOKWORM: 10,
  AVID_READER: 50,
  LIBRARY_MASTER: 100,
  WEEK_STREAK: 7,
  MONTH_STREAK: 30,
  YEAR_STREAK: 365,
  REVIEWER: 5,
  CRITIC: 25,
  EXPERT_REVIEWER: 100,
};

// Theme
export const THEME_STORAGE_KEY = 'library-theme';
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;
