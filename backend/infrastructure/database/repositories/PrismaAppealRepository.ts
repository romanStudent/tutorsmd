import { Prisma, PrismaClient } from '../../../generated/prisma';
import {
  IAppealRepository,
  AppealRecord,
  CreateAppealData,
  AppealStatus,
} from '../../../domain/repositories/IAppealRepository';

type AppealRow = Prisma.AppealGetPayload<{}>;

export class PrismaAppealRepository implements IAppealRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<AppealRecord | null> {
    const record = await this.prisma.appeal.findUnique({ where: { id } });
    if (!record) return null;
    return this.toRecord(record);
  }

  async findByLessonId(lessonId: string): Promise<AppealRecord[]> {
    const records = await this.prisma.appeal.findMany({
      where:   { lessonId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(r => this.toRecord(r));
  }

  async findAllOpen(): Promise<AppealRecord[]> {
    const records = await this.prisma.appeal.findMany({
      where:   { status: 'open' },
      orderBy: { createdAt: 'asc' },
    });
    return records.map(r => this.toRecord(r));
  }

  async findAll(): Promise<AppealRecord[]> {
    const records = await this.prisma.appeal.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return records.map(r => this.toRecord(r));
  }

  async create(data: CreateAppealData): Promise<AppealRecord> {
    const record = await this.prisma.appeal.create({
      data: {
        id:        data.id,
        lessonId:  data.lessonId,
        clientId:  data.clientId,
        tutorId:   data.tutorId,
        text:      data.text,
        expiresAt: data.expiresAt,
      },
    });
    return this.toRecord(record);
  }

  async resolve(id: string, adminId: string): Promise<void> {
    await this.prisma.appeal.update({
      where: { id },
      data: {
        status:     'resolved',
        resolvedBy: adminId,
        resolvedAt: new Date(),
      },
    });
  }

  async reject(id: string, adminId: string): Promise<void> {
    await this.prisma.appeal.update({
      where: { id },
      data: {
        status:     'rejected',
        resolvedBy: adminId,
        resolvedAt: new Date(),
      },
    });
  }

  private toRecord(r: AppealRow): AppealRecord {
    return {
      id:         r.id,
      lessonId:   r.lessonId,
      clientId:   r.clientId,
      tutorId:    r.tutorId,
      status:     r.status as AppealStatus,
      text:       r.text,
      resolvedBy: r.resolvedBy,
      resolvedAt: r.resolvedAt,
      expiresAt:  r.expiresAt,
      createdAt:  r.createdAt,
    };
  }
}