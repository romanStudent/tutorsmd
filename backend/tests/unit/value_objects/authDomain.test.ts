/**
 * Unit-тесты — только чистая логика, нет I/O.
 * Запуск: vitest run tests/unit
 */

// ─── Password ─────────────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest';
// import { Password } from '@/domain/value-objects/Password';
// import { Email }    from '@/domain/value-objects/Email';
// import { loginSchema, registerSchema } from '@/features/auth/schemas';

// Тестируем правила, которые определены в domain — они не зависят от БД.

describe('Password.validate()', () => {
  it('passes for a valid password', () => {
    // Password.validate('ValidPassword123!'); — не должен кидать
    expect(() => validatePassword('ValidPassword123!')).not.toThrow();
  });

  it('rejects passwords shorter than 15 characters', () => {
    expect(() => validatePassword('Short1!')).toThrow();
  });

  it('rejects passwords longer than 64 characters', () => {
    expect(() => validatePassword('A'.repeat(65))).toThrow();
  });

  it('accepts passwords at boundary lengths (15 and 64)', () => {
    expect(() => validatePassword('A'.repeat(15))).not.toThrow();
    expect(() => validatePassword('A'.repeat(64))).not.toThrow();
  });
});

describe('Email.create()', () => {
  it('accepts valid emails', () => {
    expect(() => createEmail('user@example.com')).not.toThrow();
    expect(() => createEmail('user+tag@sub.domain.de')).not.toThrow();
  });

  it('rejects invalid emails', () => {
    expect(() => createEmail('not-an-email')).toThrow();
    expect(() => createEmail('@domain.com')).toThrow();
    expect(() => createEmail('user@')).toThrow();
  });
});

// ─── Zod schemas ─────────────────────────────────────────────────────────────

describe('loginSchema', () => {
  const valid = { email: 'u@e.com', password: 'anypassword', activeRole: 'client' as const };

  it('passes with valid data', () => {
    const result = parseLogin(valid);
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = parseLogin({ ...valid, email: 'bad' });
    expect(result.success).toBe(false);
  });

  it('rejects unknown role', () => {
    const result = parseLogin({ ...valid, activeRole: 'superuser' as any });
    expect(result.success).toBe(false);
  });

  it('accepts all valid roles', () => {
    for (const role of ['client', 'tutor', 'admin'] as const) {
      expect(parseLogin({ ...valid, activeRole: role }).success).toBe(true);
    }
  });
});

describe('registerSchema', () => {
  const valid = {
    name: 'Anna',
    surname: 'Müller',
    email: 'anna@example.com',
    password: 'ValidPassword123!',
    confirmPassword: 'ValidPassword123!',
    languageCode: 'de' as const,
  };

  it('passes with valid data', () => {
    expect(parseRegister(valid).success).toBe(true);
  });

  it('rejects when passwords do not match', () => {
    const result = parseRegister({ ...valid, confirmPassword: 'DifferentPassword123!' });
    expect(result.success).toBe(false);
    const issue = (result as any).error.issues[0];
    expect(issue.path).toContain('confirmPassword');
  });

  it('rejects password shorter than 15 chars in schema', () => {
    const result = parseRegister({ ...valid, password: 'Short1!', confirmPassword: 'Short1!' });
    expect(result.success).toBe(false);
  });

  it('rejects name shorter than 2 chars', () => {
    expect(parseRegister({ ...valid, name: 'A' }).success).toBe(false);
  });

  it('rejects invalid languageCode', () => {
    expect(parseRegister({ ...valid, languageCode: 'fr' as any }).success).toBe(false);
  });
});

// ─── Stubs (заменить импортами из домена) ────────────────────────────────────
// Эти функции эмулируют поведение доменных классов.
// В реальном проекте замени на прямые импорты:
//   import { Password } from '@/domain/value-objects/Password';
//   Password.validate(pw);

function validatePassword(pw: string): void {
  if (pw.length < 15) throw new Error('Password too short');
  if (pw.length > 64) throw new Error('Password too long');
}

function createEmail(email: string): { value: string } {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) throw new Error('Invalid email');
  return { value: email };
}

import { z } from 'zod';

const _loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  activeRole: z.enum(['client', 'tutor', 'admin']),
});

const _registerSchema = z.object({
  name: z.string().min(2).max(100),
  surname: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(15).max(64),
  confirmPassword: z.string(),
  languageCode: z.enum(['en', 'de', 'ru']),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwörter stimmen nicht überein',
  path: ['confirmPassword'],
});

function parseLogin(data: unknown) {
  return _loginSchema.safeParse(data);
}
function parseRegister(data: unknown) {
  return _registerSchema.safeParse(data);
}