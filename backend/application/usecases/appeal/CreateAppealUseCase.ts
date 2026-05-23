import { IAppealRepository } from '../../../domain/repositories/IAppealRepository';
import { ILessonRepository } from '../../../domain/repositories/lesson/ILessonRepository';
import { IUUIDGenerator } from '../../ports/IUUIDGenerator';
import { ClientId, TutorId, LessonId, AppealId } from '../../../domain/value-objects/EntityId';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { DomainError } from '../../../domain/errors/DomainError';
import { CreateAppealDto, CreateAppealResult } from '../../dto/appeal/CreateAppealDto';

export class CreateAppealUseCase {
  constructor(
    private readonly appealRepo:  IAppealRepository,
    private readonly lessonRepo:  ILessonRepository,
    private readonly idGenerator: IUUIDGenerator,
  ) {}

  async execute(dto: CreateAppealDto): Promise<CreateAppealResult> {
    const lessonId = new LessonId(dto.lessonId);
    const appealId = new AppealId(this.idGenerator.generate());

    if (!dto.text || dto.text.trim().length === 0) {
      throw new DomainError('Appeal text cannot be empty');
    }

    // 1. Найти урок
    const lesson = await this.lessonRepo.findById(lessonId.value);
    if (!lesson) throw new NotFoundError('Lesson not found');

    // 2. Проверить участника
    if (dto.appellantRole === 'client') {
      const clientId = new ClientId(dto.appellantId);
      if (lesson.clientId !== clientId.value) {
        throw new DomainError('You are not the client of this lesson');
      }
    } else {
      const tutorId = new TutorId(dto.appellantId);
      if (lesson.tutorId !== tutorId.value) {
        throw new DomainError('You are not the tutor of this lesson');
      }
    }

    const appeal = await this.appealRepo.create({
      id:       appealId.value,
      lessonId: lessonId.value,
      clientId: dto.appellantRole === 'client' ? dto.appellantId : null,
      tutorId:  dto.appellantRole === 'tutor'  ? dto.appellantId : null,
      text:     dto.text.trim(),
      expiresAt: dto.expiresAt ?? null,
    });

    return { appealId: appeal.id };
  }
}