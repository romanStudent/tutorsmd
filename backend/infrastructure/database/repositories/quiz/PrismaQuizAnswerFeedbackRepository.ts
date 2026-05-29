import { PrismaClient } from '@prisma/client';
import { IQuizAnswerFeedbackRepository, CreateFeedbackData, UpdateFeedbackData} from '../../../../domain/repositories/quiz/IQuizAnswerFeedbackRepository';

export class PrismaQuizAnswerFeedbackRepository implements IQuizAnswerFeedbackRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async existsByAnswer(answerId: string): Promise<boolean> {
    const record = await this.prisma.quizAnswerFeedback.findUnique({
      where: { answerId },
      select: { answerId: true },
    });
    return record !== null;
  }

  async create(data: CreateFeedbackData): Promise<void> {
    await this.prisma.quizAnswerFeedback.create({
      data: {
        id: data.id,
        answerId: data.answerId,
        tutorId: data.tutorId,
        comment: data.comment,
        isCorrect: data.isCorrect,
      },
    });
  }

  async save(data: UpdateFeedbackData): Promise<void> {
    await this.prisma.quizAnswerFeedback.update({
      where: { answerId: data.answerId },
      data: {
        comment: data.comment,
        isCorrect: data.isCorrect,
        updatedAt: new Date(),
      },
    });
  }
}