import { QuestionType } from '../../entities/quiz/Quiz';

export interface CreateQuizQuestionData {
  id: string;
  quizId: string;
  question: string;
  type: QuestionType;
  order: number;
  maxPoints: number;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

export interface QuizQuestionRecord {
  id: string;
  quizId: string;
  question: string;
  type: QuestionType;
  order: number;
  maxPoints: number;
}

export interface IQuizQuestionRepository {
  findById(id: string): Promise<QuizQuestionRecord | null>;    
  findByQuizId(quizId: string): Promise<QuizQuestionRecord[]>;
  create(data: CreateQuizQuestionData): Promise<void>;
  getMaxOrder(quizId: string): Promise<number>;
  delete(id: string): Promise<void>;
}