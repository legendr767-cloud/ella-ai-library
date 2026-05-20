import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

// Profile schema
export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
  date_of_birth: z.string().optional(),
  student_id: z.string().optional(),
  department: z.string().optional(),
});

// Book schema
export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().min(10, 'Invalid ISBN').max(13, 'Invalid ISBN'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category_id: z.string().min(1, 'Category is required'),
  published_year: z.number().min(1000).max(new Date().getFullYear()),
  language: z.string().min(1, 'Language is required'),
  pages: z.number().min(1, 'Pages must be at least 1'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  shelf_location: z.string().optional(),
});

// Review schema
export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().max(1000, 'Comment must be less than 1000 characters').optional(),
});

// Category schema
export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  icon: z.string().optional(),
});

// Tag schema
export const tagSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

// File validation
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' };
  }

  return { valid: true };
};

export const validateBookFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = ['application/pdf', 'application/epub+zip'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only PDF and EPUB files are allowed' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 50MB' };
  }

  return { valid: true };
};

// Export type inference
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type BookFormData = z.infer<typeof bookSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type TagFormData = z.infer<typeof tagSchema>;
