import { describe, it, expect } from 'vitest';
import { loginSchema, signupSchema, profileSchema } from '@/lib/validations';

describe('loginSchema', () => {
  it('accepts valid email and password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: 'Password1!' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'Password1!' });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '12345' });
    expect(result.success).toBe(false);
  });
});

describe('signupSchema', () => {
  it('accepts valid signup data', () => {
    const result = signupSchema.safeParse({ email: 'user@test.com', password: 'StrongPass1!' });
    expect(result.success).toBe(true);
  });

  it('rejects empty email', () => {
    const result = signupSchema.safeParse({ email: '', password: 'StrongPass1!' });
    expect(result.success).toBe(false);
  });
});

describe('profileSchema', () => {
  it('accepts valid username', () => {
    const result = profileSchema.safeParse({ username: 'warrior123' });
    expect(result.success).toBe(true);
  });

  it('accepts empty username', () => {
    const result = profileSchema.safeParse({ username: '' });
    expect(result.success).toBe(true);
  });
});
