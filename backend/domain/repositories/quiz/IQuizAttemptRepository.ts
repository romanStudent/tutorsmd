import { QuizAttempt } from '../../entities/quiz/QuizAttempt';

export interface SubmitQuizAttemptData {
  attemptId: string;
  submittedAt: Date;
  totalPoints: number | null;
  answers: {
    id: string;
    questionId: string;
    answer: string | null;
    earnedPoints: number | null;
    selectedOptions: string[]; // optionIds
  }[];
}

export interface IQuizAttemptRepository {
  findById(id: string): Promise<QuizAttempt | null>;
  existsSubmitted(quizId: string, lessonId: string, clientId: string): Promise<boolean>;

  create(attempt: QuizAttempt): Promise<void>;
  save(attempt: QuizAttempt): Promise<void>;

  // Отдельный метод для сабмита с ответами — атомарная операция
  submit(data: SubmitQuizAttemptData): Promise<void>;
}