// application/usecases/lesson/RejectLessonUseCase.ts
import { ILessonRepository } from '../../../domain/repositories/lesson/ILessonRepository';
import { TutorId, LessonId } from '../../../domain/value-objects/EntityId';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { DomainError } from '../../../domain/errors/DomainError';

export interface RejectLessonDto {
  lessonId: string;
  tutorId: string;
  reason?: string;
}

export class RejectLessonUseCase {
  constructor(
    private readonly lessonRepo: ILessonRepository,
  ) {}

  async execute(dto: RejectLessonDto): Promise<void> {
    const lessonId = new LessonId(dto.lessonId);
    const tutorId = new TutorId(dto.tutorId);

    const lesson = await this.lessonRepo.findById(lessonId.value);
    if (!lesson) throw new NotFoundError('Lesson not found');

    if (lesson.tutorId !== tutorId.value) {
      throw new DomainError('You are not the tutor of this lesson');
    }

    // Только pending может быть отклонён
    if (lesson.status !== 'pending') {
      throw new DomainError(`Cannot reject lesson with status: ${lesson.status}`);
    }

    const rejected = lesson.cancelByTutor(dto.reason);
    await this.lessonRepo.save(rejected);
  }
}