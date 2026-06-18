/**
 * testDb.ts
 * Управление тестовой БД. Каждый тест-файл вызывает setupTestDb() в beforeAll
 * и cleanupTestDb() в afterAll. Между тестами — truncate нужных таблиц.
 *
 * Требует: DATABASE_URL в .env.test указывает на отдельную тестовую БД.
 */
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

export function getTestPrisma(): PrismaClient {
  if (!prisma) {
    const TEST_DB_URL = process.env.DATABASE_TEST_URL 
  ?? 'postgresql://postgres:postgres@localhost:5433/tutorsmd_test';
    prisma = new PrismaClient({
      datasources: { db: { url: TEST_DB_URL } },
    });
  }
  return prisma;
}

export async function setupTestDb() {
  const db = getTestPrisma();
  await db.$connect();
}

export async function cleanupTestDb() {
  const db = getTestPrisma();
  await db.$disconnect();
}

/**
 * Truncate в правильном порядке (FK constraints).
 * Вызывай в beforeEach для изоляции тестов.
 */
export async function truncateAuthTables() {
  const db = getTestPrisma();
  // Порядок важен: сначала зависимые таблицы
  await db.$executeRawUnsafe(`
    TRUNCATE TABLE
      email_verifications,
      email_changes,
      password_resets,
      refresh_tokens,
      clients,
      tutors,
      users
    RESTART IDENTITY CASCADE
  `);
}