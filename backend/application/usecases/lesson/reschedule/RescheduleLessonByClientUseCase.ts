import { Lesson } from '../../../../domain/entities/Lesson';
import { ILessonRepository } from '../../../../domain/repositories/ILessonRepository';
import { IUnitOfWork } from '../../../ports/IUnitOfWork';
import { IUUIDGenerator } from '../../../ports/IUUIDGenerator';
import { ClientId, LessonId } from '../../../../domain/value-objects/EntityId';
import { NotFoundError } from '../../../../domain/errors/NotFoundError';
import { DomainError } from '../../../../domain/errors/DomainError';
import { ConflictError } from '../../../../domain/errors/ConflictError';

export interface RescheduleLessonByClientDto {
  lessonId: string;
  clientId: string;
  newScheduledAt: Date;
  durationMinutes?: number;
}

export interface RescheduleLessonByClientResult {
  newLessonId: string;
  scheduledAt: Date;
}

export class RescheduleLessonByClientUseCase {
  constructor(
    private readonly lessonRepo: ILessonRepository,
    private readonly unitOfWork: IUnitOfWork,
    private readonly idGenerator: IUUIDGenerator,
  ) {}

  async execute(dto: RescheduleLessonByClientDto): Promise<RescheduleLessonByClientResult> {
    const lessonId = new LessonId(dto.lessonId);
    const clientId = new ClientId(dto.clientId);

    // 1. Найти урок
    const lesson = await this.lessonRepo.findById(lessonId.value);
    if (!lesson) throw new NotFoundError('Lesson not found');

    // 2. Проверить что именно этот клиент переносит
    if (lesson.clientId !== clientId.value) {
      throw new DomainError('You are not the client of this lesson');
    }

    // 3. Domain method проверяет статус и окно (< 2ч — нельзя)
    const rescheduled = lesson.reschedule();

    // 4. Проверяем конфликт нового слота у тьютора
    const hasConflict = await this.lessonRepo.existsConflict(
      lesson.tutorId,
      dto.newScheduledAt,
      dto.durationMinutes ?? lesson.durationMinutes,
      lesson.id, // исключаем текущий урок
    );
    if (hasConflict) {
      throw new ConflictError('This time slot is already taken');
    }

    // 5. Создаём новый урок на новое время
    const newLesson = Lesson.create({
      id: this.idGenerator.generate(),
      clientId: lesson.clientId,
      tutorId: lesson.tutorId,
      subjectId: lesson.subjectId,
      type: lesson.type,
      scheduledAt: dto.newScheduledAt,
      durationMinutes: dto.durationMinutes ?? lesson.durationMinutes,
      recurringScheduleId: lesson.recurringScheduleId,
      rescheduledFromId: lesson.id, // ссылка на старый урок
    });

    // 6. Атомарно: старый → rescheduled, новый → confirmed
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