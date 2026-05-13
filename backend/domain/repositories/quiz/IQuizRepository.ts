import { Quiz } from '../../entities/quiz/Quiz';

export interface IQuizRepository {
  findById(id: string): Promise<Quiz | null>;
  findByTutorId(tutorId: string): Promise<Quiz[]>;

  create(quiz: Quiz): Promise<void>;
  save(quiz: Quiz): Promise<void>;
  delete(id: string): Promise<void>;
}