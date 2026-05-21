import { ILessonRepository } from '../../../../domain/repositories/lesson/ILessonRepository';
import { ClientId, LessonId } from '../../../../domain/value-objects/EntityId';
import { NotFoundError } from '../../../../domain/errors/NotFoundError';
import { DomainError } from '../../../../domain/errors/DomainError';

export interface DeclineRescheduleProposalDto {
  lessonId: string;
  clientId: string;
}

export class DeclineRescheduleProposalUseCase {
  constructor(
    private readonly lessonRepo: ILessonRepository,
  ) {}

  async execute(dto: DeclineRescheduleProposalDto): Promise<void> {
    const lessonId = new LessonId(dto.lessonId);
    const clientId = new ClientId(dto.clientId);

    // 1. Найти урок
    const lesson = await this.lessonRepo.findById(lessonId.value);
    if (!lesson) throw new NotFoundError('Lesson not found');

    // 2. Проверить что именно этот клиент отклоняет
    if (lesson.clientId !== clientId.value) {
      throw new DomainError('You are not the client of this lesson');
    }

    // 3. Только pending_reschedule может быть отклонён
    if (lesson.status !== 'pending_reschedule') {
      throw new DomainError('No pending reschedule proposal for this lesson');
    }

    // 4. Domain method — возвращаем в confirmed, очищаем предложение
    const declined = lesson.declineReschedule();
    await this.lessonRepo.save(declined);
  }
}