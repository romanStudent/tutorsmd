import { ILessonRepository } from '../../../domain/repositories/ILessonRepository';
import { IUUIDGenerator } from '../../ports/IUUIDGenerator';
import { ClientId, TutorId, LessonId } from '../../../domain/value-objects/EntityId';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { DomainError } from '../../../domain/errors/DomainError';

export interface StartLessonDto {
  lessonId: string;
  startedById: string; // client.id или tutor.id
  role: 'client' | 'tutor';
}

export interface StartLessonResult {
  roomId: string;
}

export class StartLessonUseCase {
  constructor(
    private readonly lessonRepo: ILessonRepository,
    private readonly idGenerator: IUUIDGenerator,
  ) {}

  async execute(dto: StartLessonDto): Promise<StartLessonResult> {
    const lessonId = new LessonId(dto.lessonId);

    const lesson = await this.lessonRepo.findById(lessonId.value);
    if (!lesson) throw new NotFoundError('Lesson not found');

    // Проверяем что пользователь — участник урока
    if (dto.role === 'client') {
      const clientId = new ClientId(dto.startedById);
      if (lesson.clientId !== clientId.value) {
        throw new DomainError('You are not the client of this lesson');
      }
    } else {
      const tutorId = new TutorId(dto.startedById);
      if (lesson.tutorId !== tutorId.value) {
        throw new DomainError('You are not the tutor of this lesson');
      }
    }

    // Генерируем roomId для видеокомнаты
    const roomId = this.idGenerator.generate();

    // Domain method проверяет статус и временное окно
    const started = lesson.start(roomId);
    await this.lessonRepo.save(started);

    return { roomId };
  }
}