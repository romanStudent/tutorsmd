import { PrismaClient } from '../../../generated/prisma';
import { IEmailVerificationRepository } from '../../../domain/repositories/email/IEmailVerificationRepository';

export class PrismaEmailVerificationRepository implements IEmailVerificationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async upsert(data: { userId: string; link: string; expiresAt: Date }): Promise<void> {
    await this.prisma.emailVerification.upsert({
      where: { userId: data.userId },
      update: {
        linkHash: data.link,
        expiresAt: data.expiresAt,
      },
      create: {
        userId: data.userId,
        linkHash: data.link,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findByLink(link: string): Promise<{ userId: string; link: string; expiresAt: Date } | null> {
    const record = await this.prisma.emailVerification.findUnique({
      where: { linkHash: link },
    });
    if (!record) return null;
    return {
      userId: record.userId,
      link: record.linkHash,
      expiresAt: record.expiresAt,
    };
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.emailVerification.delete({
      where: { userId },
    }).catch(() => {
      // Игнорируем если записи нет
    });
  }
}