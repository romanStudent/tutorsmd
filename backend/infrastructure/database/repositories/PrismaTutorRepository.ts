import { Prisma, PrismaClient } from '../../../generated/prisma';
import { ITutorRepository, PendingTutorResult } from '../../../domain/repositories/ITutorRepository';
import { Tutor, ApprovalStatus } from '../../../domain/entities/Tutor';


type TutorRecord = Prisma.TutorGetPayload<{ select: null }>
type TutorWithUser = Prisma.TutorGetPayload<{ include: { user: true } }>


export class PrismaTutorRepository implements ITutorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Tutor | null> {
    const record = await this.prisma.tutor.findUnique({ where: { id } });
    if (!record) return null;
    return this.toDomain(record);
  }

  async findByUserId(userId: string): Promise<Tutor | null> {
    const record = await this.prisma.tutor.findUnique({ where: { userId } });
    if (!record) return null;
    return this.toDomain(record);
  }

  
  async findPendingWithUser(): Promise<PendingTutorResult[]> {
    const records = await this.prisma.tutor.findMany({
      where: { approvalStatus: 'pending' },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
 

    return records.map((r: TutorWithUser) => ({
      tutorId: r.id,
      userId: r.userId,
      name: r.user.name,
      surnameDe: r.surnameDe,
      surnameRu: r.surnameRu,
      surname: r.user.surname,
      email: r.user.email,
      nameDe: r.nameDe,
      nameRu: r.nameRu,
      createdAt: r.createdAt,
    }));
  }

  async create(tutor: Tutor): Promise<void> {
    await this.prisma.tutor.create({
      data: {
        id: tutor.id,
        userId: tutor.userId,
        fulldescribeDe: tutor.fulldescribeDe,
        fulldescribeRu: tutor.fulldescribeRu,
        highlightDe: tutor.highlightDe,
        highlightRu: tutor.highlightRu,
        hourlyRate: tutor.hourlyRate,
        ratingAvg: tutor.ratingAvg,
        ratingCount: tutor.ratingCount,
        nameDe: tutor.nameDe,
        nameRu: tutor.nameRu,
        surnameDe: tutor.surnameDe,
        surnameRu: tutor.surnameRu,
        approvalStatus: tutor.approvalStatus,
        approvedAt: tutor.approvedAt,
        approvedBy: tutor.approvedBy,
        createdAt: tutor.createdAt,
        updatedAt: tutor.updatedAt,
      },
    });
  }

  async save(tutor: Tutor): Promise<void> {
    await this.prisma.tutor.update({
      where: { id: tutor.id },
      data: {
        fulldescribeDe: tutor.fulldescribeDe,
        fulldescribeRu: tutor.fulldescribeRu,
        highlightDe: tutor.highlightDe,
        highlightRu: tutor.highlightRu,
        hourlyRate: tutor.hourlyRate,
        ratingAvg: tutor.ratingAvg,
        ratingCount: tutor.ratingCount,
        nameDe: tutor.nameDe,
        nameRu: tutor.nameRu,
        surnameDe: tutor.surnameDe,
        surnameRu: tutor.surnameRu,
        approvalStatus: tutor.approvalStatus,
        approvedAt: tutor.approvedAt,
        approvedBy: tutor.approvedBy,
        updatedAt: tutor.updatedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tutor.delete({ where: { id } });
  }

  private toDomain(record: TutorRecord): Tutor {
  return Tutor.restore({
    id: record.id,
    userId: record.userId,
    fulldescribeDe: record.fulldescribeDe,
    fulldescribeRu: record.fulldescribeRu,
    highlightDe: record.highlightDe,
    highlightRu: record.highlightRu,
    nameDe: record.nameDe,         
    nameRu: record.nameRu,         
    surnameDe: record.surnameDe,   
    surnameRu: record.surnameRu,   
    hourlyRate: Number(record.hourlyRate),
    ratingAvg: Number(record.ratingAvg),
    ratingCount: record.ratingCount,
    approvalStatus: record.approvalStatus as ApprovalStatus,
    approvedAt: record.approvedAt,
    approvedBy: record.approvedBy,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });
}
}