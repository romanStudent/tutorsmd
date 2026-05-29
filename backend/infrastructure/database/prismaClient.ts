// infrastructure/database/prismaClient.ts
// Prisma 7: PrismaClient импортируется из generated/prisma, не из @prisma/client
// adapter обязателен для Prisma 7 с PostgreSQL
import { PrismaClient } from '@prisma/client';
import { PrismaPg }    from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}