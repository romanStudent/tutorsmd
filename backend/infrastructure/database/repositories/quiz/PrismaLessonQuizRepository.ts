import { PrismaClient } from '@prisma/client';
import { ILessonQuizRepository } from '../../../../domain/repositories/quiz/ILessonQuizRepository';

export class PrismaLessonQuizRepository implements ILessonQuizRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async exists(lessonId: string, quizId: string): Promise<boolean> {
    const record = await this.prisma.lessonQuiz.findUnique({
      where: {
        lessonId_quizId: { lessonId, quizId },
      },
      select: { lessonId: true },
    });
    return record !== null;
  }

  async create(lessonId: string, quizId: string): Promise<void> {
    await this.prisma.lessonQuiz.create({
      data: { lessonId, quizId },
    });
  }

   async delete(lessonId: string, quizId: string): Promise<void> {
    await this.prisma.lessonQuiz.delete({
      where: { lessonId_quizId: { lessonId, quizId } },
    });
  }
}