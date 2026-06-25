import { PrismaClient } from '@prisma/client';
import { EmailChangeRecord, IEmailChangeRepository } from '../../../domain/repositories/email/IEmailChangeRepository';

export class PrismaEmailChangeRepository implements IEmailChangeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async upsert(data: {
    userId:         string;
    newEmail:       string;
    tokenHash:      string;
    oldConfirmHash: string;
    cancelHash:     string;
    expiresAt:      Date;
  }): Promise<void> {
    await this.prisma.emailChange.upsert({
      where:  { userId: data.userId },
      update: {
        newEmail:          data.newEmail,
        linkHash:          data.tokenHash,
        oldConfirmHash:    data.oldConfirmHash,
        cancelHash:        data.cancelHash,
        expiresAt:         data.expiresAt,
        newEmailConfirmed: false,
        oldEmailConfirmed: false,
      },
      create: {
        userId:         data.userId,
        newEmail:       data.newEmail,
        linkHash:       data.tokenHash,
        oldConfirmHash: data.oldConfirmHash,
        cancelHash:     data.cancelHash,
        expiresAt:      data.expiresAt,
      },
    });
  }

  // Новый email подтверждает владение — ставим флаг, не удаляем запись
  async consumeToken(tokenHash: string): Promise<EmailChangeRecord | null> {
    const record = await this.prisma.emailChange.findUnique({
      where: { linkHash: tokenHash },
    });

    if (!record) return null;

    const updated = await this.prisma.emailChange.update({
      where: { id: record.id },
      data:  { newEmailConfirmed: true },
    });

    return {
      id:                updated.id,
      userId:            updated.userId,
      newEmail:          updated.newEmail,
      newEmailConfirmed: updated.newEmailConfirmed,
      oldEmailConfirmed: updated.oldEmailConfirmed,
      expiresAt:         updated.expiresAt,
      createdAt:         updated.createdAt,
    };
  }

  // Старый email подтверждает согласие — ставим флаг
  async confirmOldEmail(oldConfirmHash: string): Promise<EmailChangeRecord | null> {
    const record = await this.prisma.emailChange.findUnique({
      where: { oldConfirmHash },
    });

    if (!record) return null;

    const updated = await this.prisma.emailChange.update({
      where: { id: record.id },
      data:  { oldEmailConfirmed: true },
    });

    return {
      id:                updated.id,
      userId:            updated.userId,
      newEmail:          updated.newEmail,
      newEmailConfirmed: updated.newEmailConfirmed,
      oldEmailConfirmed: updated.oldEmailConfirmed,
      expiresAt:         updated.expiresAt,
      createdAt:         updated.createdAt,
    };
  }

  // Отмена — атомарно удаляем запись
  async consumeCancelToken(cancelHash: string): Promise<EmailChangeRecord | null> {
    const record = await this.prisma.emailChange.findUnique({
      where: { cancelHash },
    });

    if (!record) return null;

    await this.prisma.emailChange.delete({ where: { id: record.id } });

    return {
      id:                record.id,
      userId:            record.userId,
      newEmail:          record.newEmail,
      newEmailConfirmed: record.newEmailConfirmed,
      oldEmailConfirmed: record.oldEmailConfirmed,
      expiresAt:         record.expiresAt,
      createdAt:         record.createdAt,
    };
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.emailChange.deleteMany({ where: { userId } });
  }
}