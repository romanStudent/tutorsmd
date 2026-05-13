import { IQuizAttemptRepository } from '../../../domain/repositories/quiz/IQuizAttemptRepository';
import { IQuizAnswerFeedbackRepository } from '../../../domain/repositories/quiz/IQuizAnswerFeedbackRepository';
import { IUUIDGenerator } from '../../ports/IUUIDGenerator';
import { IUnitOfWork } from '../../ports/IUnitOfWork';
import { TutorId } from '../../../domain/value-objects/EntityId';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { DomainError } from '../../../domain/errors/DomainError';

export interface AnswerFeedbackDto {
  answerId: string;
  comment?: string | null;
  isCorrect?: boolean | null;
  earnedPoints?: number | null;
}

export interface ProvideAnswerFeedbackDto {
  attemptId: string;
  tutorId: string;
  feedbacks: AnswerFeedbackDto[];
}

export class ProvideAnswerFeedbackUseCase {
  constructor(
    private readonly attemptRepo: IQuizAttemptRepository,
    private readonly feedbackRepo: IQuizAnswerFeedbackRepository,
    private readonly idGenerator: IUUIDGenerator,
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(dto: ProvideAnswerFeedbackDto): Promise<void> {
    const tutorId = new TutorId(dto.tutorId);

    // 1. Найти попытку
    const attempt = await this.attemptRepo.findById(dto.attemptId);
    if (!attempt) throw new NotFoundError('Quiz attempt not found');

    // 2. Попытка должна быть сабмитнута
    if (!attempt.isSubmitted) {
      throw new DomainError('Cannot provide feedback for non-submitted attempt');
    }

    // 3. Валидация earnedPoints
    for (const feedback of dto.feedbacks) {
      if (feedback.earnedPoints !== null &&
          feedback.earnedPoints !== undefined &&
          feedback.earnedPoints < 0) {
        throw new DomainError('Earned points cannot be negative');
      }
    }

    // 4. Upsert фидбек для каждого ответа + считаем totalPoints
    let totalPoints = 0;

    await this.unitOfWork.run(async () => {
      for (const feedback of dto.feedbacks) {
        const exists = await this.feedbackRepo.existsByAnswer(feedback.answerId);

        if (exists) {
          await this.feedbackRepo.save({
            answerId: feedback.answerId,
            comment: feedback.comment ?? null,
            isCorrect: feedback.isCorrect ?? null,
            earnedPoints: feedback.earnedPoints ?? null,
          });
        } else {
          await this.feedbackRepo.create({
            id: this.idGenerator.generate(),
            answerId: feedback.answerId,
            tutorId: tutorId.value,
            comment: feedback.comment ?? null,
            isCorrect: feedback.isCorrect ?? null,
            earnedPoints: feedback.earnedPoints ?? null,
          });
        }

        totalPoints += feedback.earnedPoints ?? 0;
      }

      // 5. Обновляем totalPoints в attempt
      const updated = attempt.updateTotalPoints(totalPoints);
      await this.attemptRepo.save(updated);
    });
  }
}