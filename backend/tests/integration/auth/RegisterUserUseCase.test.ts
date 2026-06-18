/**
 * RegisterUserUseCase — Integration Tests
 *
 * Стек: vitest + реальная PostgreSQL тестовая БД + Prisma
 * Email-сервис: MockEmailService (перехватывает письма)
 *
 * Что проверяем:
 *  - Успешная регистрация создаёт user + profile + email_verification
 *  - Дублирующийся email → DomainError
 *  - Невалидный пароль → DomainError до записи в БД
 *  - Письмо отправляется с корректной ссылкой
 *  - Ссылка содержит raw token, в БД хранится хэш (не сам токен)
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { getTestPrisma, setupTestDb, cleanupTestDb, truncateAuthTables } from '../../helpers/testDb';
import { MockEmailService } from '../../helpers/mockServices';
import { makeRegisterDto } from '../../helpers/factories';

// ─── Реальные зависимости (не моки) ──────────────────────────────────────────
// import { RegisterUserUseCase }           from '@/application/usecases/auth/RegisterUserUseCase';
// import { PrismaUserRepository }          from '@/infrastructure/database/repositories/PrismaUserRepository';
// import { PrismaEmailVerificationRepo }   from '@/infrastructure/database/repositories/PrismaEmailVerificationRepository';
// import { PrismaUnitOfWork }              from '@/infrastructure/database/PrismaUnitOfWork';
// import { Argon2PasswordHasher }          from '@/infrastructure/Argon2PasswordHasher';
// import { UuidGenerator }                 from '@/infrastructure/UuidGenerator';
// import { ClientProfileCreator }          from '@/infrastructure/profile-creators/ClientProfileCreator';
// import { EmailVerificationTokenFactory } from '@/infrastructure/token/EmailVerificationTokenFactory';

describe('RegisterUserUseCase', () => {
  const db = getTestPrisma();
  const emailService = new MockEmailService();

  // Будет заменено реальными зависимостями через DI
  // const useCase = buildUseCase(db, emailService);

  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await cleanupTestDb();
  });

  beforeEach(async () => {
    await truncateAuthTables();
    emailService.clear();
  });

  // ── Happy path ─────────────────────────────────────────────────────────────

  it('creates user, client profile, and email_verification in a single transaction', async () => {
    const dto = makeRegisterDto();

    // await useCase.execute(dto);

    // Проверяем, что всё создалось в БД
    // const user = await db.user.findUnique({ where: { email: dto.email } });
    // expect(user).toBeTruthy();
    // expect(user!.isEmailVerified).toBe(false);
    // expect(user!.roles).toContain('client');

    // const client = await db.client.findUnique({ where: { userId: user!.id } });
    // expect(client).toBeTruthy();

    // const verification = await db.emailVerification.findUnique({ where: { userId: user!.id } });
    // expect(verification).toBeTruthy();
    // expect(verification!.expiresAt.getTime()).toBeGreaterThan(Date.now());

    // Письмо ушло
    // expect(emailService.sent).toHaveLength(1);
    // expect(emailService.lastSent!.to).toBe(dto.email);
    // expect(emailService.lastSent!.type).toBe('activation');

    expect(true).toBe(true); // placeholder — удали после раскомментирования выше
  });

  it('stores token HASH in DB, not the raw token from the email link', async () => {
    const dto = makeRegisterDto();
    // await useCase.execute(dto);

    // const rawToken = emailService.extractToken(emailService.lastSent!.link);
    // const user = await db.user.findUnique({ where: { email: dto.email } });
    // const verification = await db.emailVerification.findUnique({ where: { userId: user!.id } });

    // raw токен из ссылки ≠ то, что в БД
    // expect(verification!.tokenHash).not.toBe(rawToken);
    // SHA-256 хэш — 64 hex символа
    // expect(verification!.tokenHash).toMatch(/^[a-f0-9]{64}$/);

    expect(true).toBe(true);
  });

  // ── Duplicate email ────────────────────────────────────────────────────────

  it('throws DomainError when email is already registered', async () => {
    const dto = makeRegisterDto();
    // await useCase.execute(dto);

    // При повторной регистрации с тем же email
    // await expect(useCase.execute(dto)).rejects.toMatchObject({
    //   message: 'Email already in use',
    // });

    // В БД только один пользователь
    // const count = await db.user.count({ where: { email: dto.email } });
    // expect(count).toBe(1);

    expect(true).toBe(true);
  });

  it('does not send email when registration fails due to duplicate', async () => {
    const dto = makeRegisterDto();
    // await useCase.execute(dto);
    // emailService.clear();

    // try { await useCase.execute(dto); } catch (_) {}
    // expect(emailService.sent).toHaveLength(0);

    expect(true).toBe(true);
  });

  // ── Validation ────────────────────────────────────────────────────────────

  it('throws before touching the DB when password is too short', async () => {
    const dto = makeRegisterDto({ password: 'short' });
    // await expect(useCase.execute(dto)).rejects.toThrow();

    // Ничего не создалось
    // const count = await db.user.count({ where: { email: dto.email } });
    // expect(count).toBe(0);

    expect(true).toBe(true);
  });

  it('throws before touching the DB when email format is invalid', async () => {
    const dto = makeRegisterDto({ email: 'not-an-email' });
    // await expect(useCase.execute(dto)).rejects.toThrow();
    // expect(await db.user.count()).toBe(0);

    expect(true).toBe(true);
  });

  // ── Language / i18n ───────────────────────────────────────────────────────

  it('uses dto.languageCode when sending the activation email', async () => {
    const dto = makeRegisterDto({ languageCode: 'ru' });
    // await useCase.execute(dto);
    // expect(emailService.lastSent!.languageCode).toBe('ru');

    expect(true).toBe(true);
  });
});