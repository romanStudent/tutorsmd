import { IQuizAttemptRepository } from '../../../domain/repositories/quiz/IQuizAttemptRepository';
import { IUUIDGenerator } from '../../ports/IUUIDGenerator';
import { IUnitOfWork } from '../../ports/IUnitOfWork';
import { ClientId } from '../../../domain/value-objects/EntityId';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { DomainError } from '../../../domain/errors/DomainError';
import { IQuizQuestionRepository } from '../../../domain/repositories/quiz/IQuizQuestionRepository';

export interface SubmitAnswerDto {
  questionId: string;
  answer?: string | null;        // free_text
  selectedOptions?: string[];    // optionIds для choice
}

export interface SubmitQuizAttemptDto {
  attemptId: string;
  clientId: string;
  answers: SubmitAnswerDto[];
}
export class SubmitQuizAttemptUseCase {
  constructor(
    private readonly attemptRepo: IQuizAttemptRepository,
    private readonly questionRepo: IQuizQuestionRepository,
    private readonly idGenerator: IUUIDGenerator,
  ) {}

  async execute(dto: SubmitQuizAttemptDto): Promise<void> {
    const clientId = new ClientId(dto.clientId);

    const attempt = await this.attemptRepo.findById(dto.attemptId);
    if (!attempt) throw new NotFoundError('Quiz attempt not found');

    if (attempt.clientId !== clientId.value) {
      throw new DomainError('You are not the owner of this attempt');
    }

    if (!dto.answers || dto.answers.length === 0) {
      throw new DomainError('At least one answer is required');
    }

    // Валидация типов вопросов
    const answers = await Promise.all(dto.answers.map(async a => {
      const question = await this.questionRepo.findById(a.questionId);
      if (!question) throw new NotFoundError(`Question ${a.questionId} not found`);

      if (question.type === 'free_text') {
        if (!a.answer || a.answer.trim().length === 0) {
          throw new DomainError(`Question ${a.questionId} requires text answer`);
        }
      } else {
        if (!a.selectedOptions || a.selectedOptions.length === 0) {
          throw new DomainError(`Question ${a.questionId} requires selected options`);
        }
        if (question.type === 'single_choice' && a.selectedOptions.length > 1) {
          throw new DomainError(`Question ${a.questionId} allows only one answer`);
        }
      }

      return {
        id: this.idGenerator.generate(),
        questionId: a.questionId,
        answer: a.answer ?? null,
        earnedPoints: null,
        selectedOptions: a.selectedOptions ?? [],
      };
    }));

    // Domain method проверяет что не сабмитил дважды
    const submitted = attempt.submit();

    // submit — одна атомарная операция, unitOfWork не нужен
    await this.attemptRepo.submit({
      attemptId: submitted.id,
      submittedAt: submitted.submittedAt!,
      totalPoints: null,
      answers,
    });
  }
}