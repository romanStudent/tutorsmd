import { PrismaClient } from '../../../generated/prisma';
import { IEmailChangeRepository } from '../../../domain/repositories/email/IEmailChangeRepository';

export class PrismaEmailChangeRepository implements IEmailChangeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async upsert(data: {
    userId: string;
    newEmail: string;
    link: string;
    expiresAt: Date;
  }): Promise<void> {
    await this.prisma.emailChange.upsert({
      where: { userId: data.userId },
      update: {
        newEmail: data.newEmail,
        linkHash: data.link,
        expiresAt: data.expiresAt,
      },
      create: {
        userId: data.userId,
        newEmail: data.newEmail,
        linkHash: data.link,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findByLink(link: string): Promise<{
    userId: string;
    newEmail: string;
    expiresAt: Date;
  } | null> {
    const record = await this.prisma.emailChange.findUnique({
      where: { linkHash: link },
      select: { userId: true, newEmail: true, expiresAt: true },
    });
    return record ?? null;
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.emailChange.deleteMany({ where: { userId } });
  }
}