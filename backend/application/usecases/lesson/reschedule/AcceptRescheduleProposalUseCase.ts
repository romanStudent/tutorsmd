import { Lesson } from '../../../../domain/entities/Lesson';
import { ILessonRepository } from '../../../../domain/repositories/lesson/ILessonRepository';
import { IUnitOfWork } from '../../../ports/IUnitOfWork';
import { IUUIDGenerator } from '../../../ports/IUUIDGenerator';
import { ClientId, LessonId } from '../../../../domain/value-objects/EntityId';
import { NotFoundError } from '../../../../domain/errors/NotFoundError';
import { DomainError } from '../../../../domain/errors/DomainError';

export interface AcceptRescheduleProposalDto {
  lessonId: string;
  clientId: string;
}

export interface AcceptRescheduleProposalResult {
  newLessonId: string;
  scheduledAt: Date;
}

export class AcceptRescheduleProposalUseCase {
  constructor(
    private readonly lessonRepo: ILessonRepository,
    private readonly unitOfWork: IUnitOfWork,
    private readonly idGenerator: IUUIDGenerator,
  ) {}

  async execute(dto: AcceptRescheduleProposalDto): Promise<AcceptRescheduleProposalResult> {
    const lessonId = new LessonId(dto.lessonId);
    const clientId = new ClientId(dto.clientId);

    // 1. Найти урок
    const lesson = await this.lessonRepo.findById(lessonId.value);
    if (!lesson) throw new NotFoundError('Lesson not found');

    // 2. Проверить что именно этот клиент принимает
    if (lesson.clientId !== clientId.value) {
      throw new DomainError('You are not the client of this lesson');
    }

    // 3. Только pending_reschedule может быть принят
    if (lesson.status !== 'pending_reschedule') {
      throw new DomainError(`No pending reschedule proposal for this lesson`);
    }

    // 4. Проверить что предложение не истекло
    if (lesson.proposedExpiresAt && lesson.proposedExpiresAt < new Date()) {
      throw new DomainError('Reschedule proposal has expired');
    }

    if (!lesson.proposedScheduledAt) {
      throw new DomainError('No proposed time found');
    }

    // 5. Создаём новый урок на предложенное время
    const newLesson = Lesson.create({
      id: this.idGenerator.generate(),
      clientId: lesson.clientId,
      tutorId: lesson.tutorId,
      subjectId: lesson.subjectId,
      type: lesson.type,
      scheduledAt: lesson.proposedScheduledAt,
      durationMinutes: lesson.durationMinutes,
      recurringScheduleId: lesson.recurringScheduleId,
      rescheduledFromId: lesson.id,
    });

    // 6. Старый урок закрываем
    const rescheduled = lesson.reschedule();

    // 7. Атомарно: старый → rescheduled, новый → confirmed
    await this.unitOfWork.run(async () => {
      await this.lessonRepo.save(rescheduled);
      await this.lessonRepo.create(newLesson);
    });

    return {
      newLessonId: newLesson.id,
      scheduledAt: newLesson.scheduledAt,
    };
  }
}