import { Lesson } from '../../../../domain/entities/Lesson';
import { IRegularScheduleRepository } from '../../../../domain/repositories/IRegularScheduleRepository';
import { ILessonRepository } from '../../../../domain/repositories/ILessonRepository';
import { IUUIDGenerator } from '../../../ports/IUUIDGenerator';
import { LessonId, RecurringScheduleId } from '../../../../domain/value-objects/EntityId';
import { NotFoundError } from '../../../../domain/errors/NotFoundError';

export interface GenerateNextRegularLessonDto {
  completedLessonId: string;
}

export class GenerateNextRegularLessonUseCase {
  constructor(
    private readonly scheduleRepo: IRegularScheduleRepository,
    private readonly lessonRepo: ILessonRepository,
    private readonly idGenerator: IUUIDGenerator,
  ) {}

  async execute(dto: GenerateNextRegularLessonDto): Promise<void> {
    const lessonId = new LessonId(dto.completedLessonId);

    // 1. Найти завершённый урок
    const completedLesson = await this.lessonRepo.findById(lessonId.value);
    if (!completedLesson) throw new NotFoundError('Lesson not found');

    // 2. Только regular уроки генерируют следующий
    if (!completedLesson.isRegular) return;

    // 3. Только completed статус триггерит генерацию
    if (!completedLesson.isCompleted) return;

    // 4. Нет расписания — разовый regular урок, не генерируем
    if (!completedLesson.recurringScheduleId) return;

    const scheduleId = new RecurringScheduleId(completedLesson.recurringScheduleId);

    // 5. Найти расписание
    const schedule = await this.scheduleRepo.findById(scheduleId.value);
    if (!schedule) return;

    // 6. Расписание деактивировано — серия завершена
    if (!schedule.isActive) return;

    // 7. Вычисляем дату следующего урока — +7 дней от текущего
    const nextScheduledAt = new Date(completedLesson.scheduledAt);
    nextScheduledAt.setDate(nextScheduledAt.getDate() + 7);
 
    // 6. Проверяем конфликт слотов у тьютора
    const hasConflict = await this.lessonRepo.existsConflict(
      completedLesson.tutorId,
      nextScheduledAt,
      completedLesson.durationMinutes,
    );

      if (hasConflict) {
      // Конфликт — не генерируем автоматически
      // TODO: уведомить тьютора и клиента что нужно выбрать новое время
      // Это можно сделать через email service или domain event
      return;
    }

    // 8. Создаём следующий урок
    const nextLesson = Lesson.create({
      id: this.idGenerator.generate(),
      clientId: completedLesson.clientId,
      tutorId: completedLesson.tutorId,
      subjectId: completedLesson.subjectId,
      type: 'regular',
      scheduledAt: nextScheduledAt,
      durationMinutes: completedLesson.durationMinutes,
      recurringScheduleId: schedule.id,
    });

    await this.lessonRepo.create(nextLesson);
  }
}