export interface ILessonQuizRepository {
  exists(lessonId: string, quizId: string): Promise<boolean>;
  create(lessonId: string, quizId: string): Promise<void>;
  delete(lessonId: string, quizId: string): Promise<void>;
}