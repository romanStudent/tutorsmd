import { QuizAttempt } from '../../../domain/entities/quiz/QuizAttempt';
import { IQuizRepository } from '../../../domain/repositories/quiz/IQuizRepository';
import { ILessonRepository } from '../../../domain/repositories/ILessonRepository';
import { IQuizAttemptRepository } from '../../../domain/repositories/quiz/IQuizAttemptRepository';
import { IUUIDGenerator } from '../../ports/IUUIDGenerator';
import { ClientId, LessonId, QuizId } from '../../../domain/value-objects/EntityId';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { DomainError } from '../../../domain/errors/DomainError';
import { ConflictError } from '../../../domain/errors/ConflictError';

export interface StartQuizAttemptDto {
  quizId: string;
  clientId: string;
  lessonId?: string | null;
}

export interface StartQuizAttemptResult {
  attemptId: string;
  startedAt: Date;
}

export class StartQuizAttemptUseCase {
  constructor(
    private readonly quizRepo: IQuizRepository,
    private readonly lessonRepo: ILessonRepository,
    private readonly attemptRepo: IQuizAttemptRepository,
    private readonly idGenerator: IUUIDGenerator,
  ) {}

  async execute(dto: StartQuizAttemptDto): Promise<StartQuizAttemptResult> {
    const quizId = new QuizId(dto.quizId);
    const clientId = new ClientId(dto.clientId);

    // 1. Квиз существует
    const quiz = await this.quizRepo.findById(quizId.value);
    if (!quiz) throw new NotFoundError('Quiz not found');

    // 2. Если привязан к уроку — проверяем участника
    if (dto.lessonId) {
      const lessonId = new LessonId(dto.lessonId);
      const lesson = await this.lessonRepo.findById(lessonId.value);
      if (!lesson) throw new NotFoundError('Lesson not found');

      if (lesson.clientId !== clientId.value) {
        throw new DomainError('You are not the client of this lesson');
      }

      // Квиз уже был пройден в этом уроке
      const alreadySubmitted = await this.attemptRepo.existsSubmitted(
        quizId.value,
        lessonId.value,
        clientId.value,
      );
      if (alreadySubmitted) {
        throw new ConflictError('Quiz already submitted for this lesson');
      }
    }

    // 3. Создаём attempt через entity
    const attempt = QuizAttempt.create({
      id: this.idGenerator.generate(),
      quizId: quizId.value,
      lessonId: dto.lessonId ?? null,
      clientId: clientId.value,
    });

    await this.attemptRepo.create(attempt);

    return {
      attemptId: attempt.id,
      startedAt: attempt.startedAt,
    };
  }
}