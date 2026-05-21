import { DomainError } from "../../../../domain/errors/DomainError";
import { NotFoundError } from "../../../../domain/errors/NotFoundError";
import { ILessonRepository } from "../../../../domain/repositories/lesson/ILessonRepository";
import { IRegularScheduleRepository } from "../../../../domain/repositories/lesson/IRegularScheduleRepository";
import { ClientId, RecurringScheduleId, TutorId } from "../../../../domain/value-objects/EntityId";
import { IUnitOfWork } from "../../../ports/IUnitOfWork";
import { CancelLessonUseCase } from "../CancelLessonUseCase";

export interface CancelRegularScheduleDto {
  scheduleId: string;
  cancelledByUserId: string; // client.id или tutor.id
  role: 'client' | 'tutor';
}

export class CancelRegularScheduleUseCase {
  constructor(
    private readonly scheduleRepo: IRegularScheduleRepository,
    private readonly lessonRepo: ILessonRepository,
    private readonly cancelLessonUseCase: CancelLessonUseCase, 
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(dto: CancelRegularScheduleDto): Promise<void> {
    const scheduleId = new RecurringScheduleId(dto.scheduleId);

    const schedule = await this.scheduleRepo.findById(scheduleId.value);
    if (!schedule) throw new NotFoundError('Schedule not found');

    // Проверка участника
    if (dto.role === 'client') {
      const clientId = new ClientId(dto.cancelledByUserId);
      if (schedule.clientId !== clientId.value) {
        throw new DomainError('You are not the client of this schedule');
      }
    } else {
      const tutorId = new TutorId(dto.cancelledByUserId);
      if (schedule.tutorId !== tutorId.value) {
        throw new DomainError('You are not the tutor of this schedule');
      }
    }

    // Деактивируем расписание
    const cancelled = dto.role === 'client'
      ? schedule.cancelByClient()
      : schedule.cancelByTutor();

    // Найти будущие confirmed уроки серии
    const futureLessons = await this.lessonRepo.findMany({
      recurringScheduleId: scheduleId.value,
      status: 'confirmed',
    });

    const now = new Date();
    const futureLessonsToCancel = futureLessons.filter(l => l.scheduledAt > now);

    // Атомарно — расписание + отмена уроков через CancelLessonUseCase
    await this.unitOfWork.run(async () => {
      await this.scheduleRepo.save(cancelled);
      await Promise.all(
        futureLessonsToCancel.map(l =>
          this.cancelLessonUseCase.execute({
            lessonId: l.id,
            cancelledByUserId: dto.cancelledByUserId,
            role: dto.role,
            reason: 'Regular schedule cancelled',
          })
        )
      );
    });
  }
}