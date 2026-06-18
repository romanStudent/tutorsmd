/**
 * factories.ts
 * Фабрики тестовых данных. Принцип: разумные дефолты + точечный override.
 */
import { v4 as uuid } from 'uuid';
import * as argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';

// ─── DTOs ────────────────────────────────────────────────────────────────────

export interface UserSeed {
  id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  passwordHash: string | null;
  isEmailVerified: boolean;
  languageCode: string;
  timezone: string;
  authProvider: string;
}

export interface RegisterDto {
  name: string;
  surname: string;
  email: string;
  password: string;
  languageCode?: 'de' | 'en' | 'ru';
  timezone?: string;
}

// ─── Генераторы ──────────────────────────────────────────────────────────────

export const VALID_PASSWORD = 'ValidPassword123!';

export function makeRegisterDto(overrides: Partial<RegisterDto> = {}): RegisterDto {
  return {
    name: 'Test',
    surname: 'User',
    email: `test_${uuid().slice(0, 8)}@example.com`,
    password: VALID_PASSWORD,
    languageCode: 'de',
    timezone: 'Europe/Berlin',
    ...overrides,
  };
}

/**
 * Создаёт пользователя напрямую в БД, минуя use case.
 * Используй когда тест проверяет не регистрацию, а что-то другое (логин, etc.)
 */
export async function seedUser(
  db: PrismaClient,
  overrides: Partial<UserSeed & { role: 'client' | 'tutor' }> = {},
): Promise<UserSeed> {
  const id = uuid();
  const role = overrides.role ?? 'client';
  const passwordHash = await argon2.hash(VALID_PASSWORD, {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
    secret: Buffer.from(process.env.PASSWORD_PEPPER ?? 'test-pepper'),
  });

  const user = await db.user.create({
    data: {
      id,
      name: overrides.name ?? 'Test',
      surname: overrides.surname ?? 'User',
      username: overrides.username ?? `tu_${id.slice(0, 6)}`,
      email: overrides.email ?? `test_${id.slice(0, 8)}@example.com`,
      passwordHash: overrides.passwordHash ?? passwordHash,
      isEmailVerified: overrides.isEmailVerified ?? true,
      languageCode: overrides.languageCode ?? 'de',
      timezone: overrides.timezone ?? 'Europe/Berlin',
      authProvider: overrides.authProvider ?? 'local',
    },
  });

  enum Role {'client', 'tutor'}
  await db.userRole.create({
    data: { userId: id, role },
  });

  // Создать профиль
  const profileId = uuid();
  if (role === 'client') {
    await db.client.create({ data: { id: profileId, userId: id } });
  } else if (role === 'tutor') {
    await db.tutor.create({
      data: {
        id: profileId,
        userId: id,
        approvalStatus: 'approved',
        fulldescribeDe: "Bla",
        fulldescribeRu: "Бла",
        highlightDe: "Bla highlight",
        highlightRu: "Бла хай",
        nameDe: "swxq",
        nameRu: "bhjfec",
        surnameDe: "dwe",
        surnameRu: "dwecr",
        hourlyRate: 19.8,
        ratingAvg: 0,
        ratingCount: 0,
        approvedAt: new Date(),
        approvedBy: id,
        rejectionReason: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    });
  }

  return user as UserSeed;
}

/**
 * Создаёт запись верификации email
 */
export async function seedEmailVerification(
  db: PrismaClient,
  userId: string,
  opts: { tokenHash: string; expiresAt?: Date },
) {
  return db.emailVerification.upsert({
    where: { userId },
    create: {
      userId,
      linkHash: opts.tokenHash,
      expiresAt: opts.expiresAt ?? new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    update: {
      linkHash: opts.tokenHash,
      expiresAt: opts.expiresAt ?? new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
}

/**
 * Создаёт refresh token запись
 */
export async function seedRefreshToken(
  db: PrismaClient,
  userId: string,
  opts: { tokenHash: string; expiresAt?: Date; deviceInfo?: string },
) {
  return db.refreshToken.create({
    data: {
      userId,
      tokenHash: opts.tokenHash,
      deviceInfo: opts.deviceInfo ?? 'Test Device',
      expiresAt: opts.expiresAt ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
}