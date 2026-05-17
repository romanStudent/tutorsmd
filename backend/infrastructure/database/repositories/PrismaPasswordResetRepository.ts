import { PrismaClient } from '../../../generated/prisma';
import { IPasswordResetRepository } from '../../../domain/repositories/IPasswordResetRepository';

export class PrismaPasswordResetRepository implements IPasswordResetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async upsert(data: { userId: string; link: string; expiresAt: Date }): Promise<void> {
    await this.prisma.passwordReset.upsert({
      where: { userId: data.userId },
      update: { linkHash: data.link, expiresAt: data.expiresAt },
      create: { userId: data.userId, linkHash: data.link, expiresAt: data.expiresAt },
    });
  }
 

  async findByLink(link: string): Promise<{ userId: string; link: string; expiresAt: Date } | null> {
    const record = await this.prisma.passwordReset.findUnique({
      where: { linkHash: link },
      select: { userId: true, expiresAt: true },
    });
    return record ? { ...record, link } : null;
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.passwordReset.deleteMany({ where: { userId } });
  }
}