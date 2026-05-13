import { IQuizRepository } from '../../../domain/repositories/quiz/IQuizRepository';
import { IQuizQuestionRepository } from '../../../domain/repositories/quiz/IQuizQuestionRepository';
import { IUUIDGenerator } from '../../ports/IUUIDGenerator';
import { TutorId, QuizId, QuizQuestionId } from '../../../domain/value-objects/EntityId';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { DomainError } from '../../../domain/errors/DomainError';
import { QuestionType } from '../../../domain/entities/quiz/Quiz';

export interface QuizOptionDto {
  text: string;
  isCorrect: boolean;
}

export interface AddQuizQuestionDto {
  quizId: string;
  tutorId: string;
  question: string;
  type: QuestionType;
  maxPoints?: number;
  options?: QuizOptionDto[];
}

export interface AddQuizQuestionResult {
  questionId: string;
  order: number;
}

export class AddQuizQuestionUseCase {
  constructor(
    private readonly quizRepo: IQuizRepository,
    private readonly questionRepo: IQuizQuestionRepository,
    private readonly idGenerator: IUUIDGenerator,
  ) {}

  async execute(dto: AddQuizQuestionDto): Promise<AddQuizQuestionResult> {
    const quizId = new QuizId(dto.quizId);
    const tutorId = new TutorId(dto.tutorId);
    const questionId = new QuizQuestionId(this.idGenerator.generate());

    // 1. Найти квиз
    const quiz = await this.quizRepo.findById(quizId.value);
    if (!quiz) throw new NotFoundError('Quiz not found');

    // 2. Тьютор может редактировать только свой квиз
    if (quiz.tutorId !== tutorId.value) {
      throw new DomainError('You can only add questions to your own quiz');
    }

    // 3. Валидация
    if (!dto.question || dto.question.trim().length === 0) {
      throw new DomainError('Question text cannot be empty');
    }

    // 4. Для choice-типов нужны варианты ответов
    if (dto.type !== 'free_text') {
      if (!dto.options || dto.options.length < 2) {
        throw new DomainError('Choice questions must have at least 2 options');
      }
      const hasCorrect = dto.options.some(o => o.isCorrect);
      if (!hasCorrect) {
        throw new DomainError('At least one option must be marked as correct');
      }
    }

    // 5. Получаем текущий максимальный порядок — новый вопрос идёт последним
    const maxOrder = await this.questionRepo.getMaxOrder(quizId.value);
    const order = maxOrder + 1;

    // 6. Генерируем ID для опций
    const options = (dto.options ?? []).map(o => ({
      id: this.idGenerator.generate(),
      text: o.text.trim(),
      isCorrect: o.isCorrect,
    }));

    await this.questionRepo.create({
      id: questionId.value,
      quizId: quizId.value,
      question: dto.question.trim(),
      type: dto.type,
      order,
      maxPoints: dto.maxPoints ?? 1,
      options,
    });

    return { questionId: questionId.value, order };
  }
}