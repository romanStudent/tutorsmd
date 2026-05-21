import { ILessonRepository } from '../../../domain/repositories/lesson/ILessonRepository';
import { ITutorRepository } from '../../../domain/repositories/ITutorRepository';
import { TutorId, LessonId } from '../../../domain/value-objects/EntityId';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { DomainError } from '../../../domain/errors/DomainError';

export interface ConfirmLessonDto {
  lessonId: string;
  tutorId: string;
}

export class ConfirmLessonUseCase {
  constructor(
    private readonly lessonRepo: ILessonRepository,
    private readonly tutorRepo: ITutorRepository,
  ) {}

  async execute(dto: ConfirmLessonDto): Promise<void> {
    const lessonId = new LessonId(dto.lessonId);
    const tutorId = new TutorId(dto.tutorId);

    // 1. Найти урок
    const lesson = await this.lessonRepo.findById(lessonId.value);
    if (!lesson) throw new NotFoundError('Lesson not found');

    // 2. Проверить что именно этот тьютор подтверждает
    if (lesson.tutorId !== tutorId.value) {
      throw new DomainError('You are not the tutor of this lesson');
    }

    // 3. Только pending может быть подтверждён
    if (lesson.status !== 'pending') {
      throw new DomainError(`Cannot confirm lesson with status: ${lesson.status}`);
    }

    // 4. Подтверждаем
    const confirmed = lesson.confirm();
    await this.lessonRepo.save(confirmed);
  }
}