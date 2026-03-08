import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').max(255, 'Email too long'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128, 'Password too long'),
});

export const signupSchema = z.object({
  username: z.string().trim().min(2, 'Username must be at least 2 characters').max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().trim().email('Please enter a valid email address').max(255, 'Email too long'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128, 'Password too long'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').max(255, 'Email too long'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters').max(128, 'Password too long'),
});

export const profileSchema = z.object({
  username: z.string().trim().min(2, 'Username must be at least 2 characters').max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
});

export const chatMessageSchema = z.object({
  content: z.string().trim().min(1, 'Message cannot be empty').max(500, 'Message too long'),
});
