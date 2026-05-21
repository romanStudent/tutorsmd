import { Lesson, LessonStatus, LessonType } from '../../entities/Lesson';

export interface FindLessonsFilter {
  clientId?: string;
  tutorId?: string;
  status?: LessonStatus;
  type?: LessonType;
  recurringScheduleId?: string;
}

export interface ILessonRepository {
  findById(id: string): Promise<Lesson | null>;

  // Расписание, история уроков
  findMany(filter: FindLessonsFilter): Promise<Lesson[]>;

  // Конфликт слотов у тьютора
  existsConflict(
    tutorId: string,
    scheduledAt: Date,
    durationMinutes: number,
    excludeId?: string,
  ): Promise<boolean>;

  // Уникальность trial на пару (client, tutor)
  existsActiveTrial(clientId: string, tutorId: string): Promise<boolean>;

  // Последний урок серии — для генерации следующего после completed
  findLastInSchedule(recurringScheduleId: string): Promise<Lesson | null>;

  create(lesson: Lesson): Promise<void>;
  save(lesson: Lesson): Promise<void>;
}