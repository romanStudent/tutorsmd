import { ILessonRepository } from '../../../../domain/repositories/ILessonRepository';
import { TutorId, LessonId } from '../../../../domain/value-objects/EntityId';
import { NotFoundError } from '../../../../domain/errors/NotFoundError';
import { DomainError } from '../../../../domain/errors/DomainError';
import { ConflictError } from '../../../../domain/errors/ConflictError';

export interface ProposeLessonRescheduleDto {
  lessonId: string;
  tutorId: string;
  proposedScheduledAt: Date;
}

// Сколько времени у клиента чтобы ответить на предложение
const PROPOSAL_EXPIRES_HOURS = 48;

export class ProposeLessonRescheduleUseCase {
  constructor(
    private readonly lessonRepo: ILessonRepository,
  ) {}

  async execute(dto: ProposeLessonRescheduleDto): Promise<void> {
    const lessonId = new LessonId(dto.lessonId);
    const tutorId = new TutorId(dto.tutorId);

    // 1. Найти урок
    const lesson = await this.lessonRepo.findById(lessonId.value);
    if (!lesson) throw new NotFoundError('Lesson not found');

    // 2. Проверить что именно этот тьютор предлагает перенос
    if (lesson.tutorId !== tutorId.value) {
      throw new DomainError('You are not the tutor of this lesson');
    }

    // 3. Только confirmed может быть перенесён
    if (!lesson.isConfirmed) {
      throw new DomainError(`Cannot propose reschedule for lesson with status: ${lesson.status}`);
    }

    // 4. Предложенное время должно быть в будущем (минимум 2ч)
    const minTime = new Date(Date.now() + 2 * 60 * 60 * 1000);
    if (dto.proposedScheduledAt < minTime) {
      throw new DomainError('Proposed time must be at least 2 hours in the future');
    }

    // 5. Проверяем конфликт предложенного слота
    const hasConflict = await this.lessonRepo.existsConflict(
      lesson.tutorId,
      dto.proposedScheduledAt,
      lesson.durationMinutes,
      lesson.id,
    );
    if (hasConflict) {
      throw new ConflictError('Proposed time slot is already taken');
    }

    // 6. Domain method — переводим в pending_reschedule
    const proposed = lesson.proposeReschedule(
      dto.proposedScheduledAt,
      new Date(Date.now() + PROPOSAL_EXPIRES_HOURS * 60 * 60 * 1000),
    );

    await this.lessonRepo.save(proposed);
  }
}