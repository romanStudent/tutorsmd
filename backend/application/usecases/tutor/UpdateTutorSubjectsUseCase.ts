import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { ITutorRepository } from '../../../domain/repositories/ITutorRepository';

export class UpdateTutorSubjectsUseCase {
  constructor(
    private readonly tutorRepo: ITutorRepository,
    private readonly prisma: PrismaClient,
  ) {}

  async execute(userId: string, subjectIds: string[]): Promise<void> {
    const tutor = await this.tutorRepo.findByUserId(userId);
    if (!tutor) throw new NotFoundError('Tutor not found');

    await this.prisma.tutorSubject.deleteMany({ where: { tutorId: tutor.id } });

    if (subjectIds.length > 0) {
      await this.prisma.tutorSubject.createMany({
        data: subjectIds.map(subjectId => ({ tutorId: tutor.id, subjectId })),
        skipDuplicates: true,
      });
    }
  }
}