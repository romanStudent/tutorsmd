import { Prisma, PrismaClient } from '../../../../generated/prisma';
import { IQuizAttemptRepository, SubmitQuizAttemptData } from '../../../../domain/repositories/quiz/IQuizAttemptRepository';
import { QuizAttempt } from '../../../../domain/entities/quiz/QuizAttempt';

type QuizAttemptRecord = Prisma.QuizAttemptGetPayload<{}>;

export class PrismaQuizAttemptRepository implements IQuizAttemptRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<QuizAttempt | null> {
    const record = await this.prisma.quizAttempt.findUnique({ where: { id } });
    if (!record) return null;
    return this.toDomain(record);
  }

  async existsSubmitted(quizId: string, lessonId: string, clientId: string): Promise<boolean> {
    const attempt = await this.prisma.quizAttempt.findFirst({
      where: {
        quizId,
        lessonId,
        clientId,
        submittedAt: { not: null },
      },
      select: { id: true },
    });
    return attempt !== null;
  }

  async create(attempt: QuizAttempt): Promise<void> {
    await this.prisma.quizAttempt.create({
      data: {
        id: attempt.id,
        quizId: attempt.quizId,
        lessonId: attempt.lessonId,
        clientId: attempt.clientId,
        startedAt: attempt.startedAt,
        createdAt: attempt.createdAt,
        updatedAt: attempt.updatedAt,
      },
    });
  }

  async save(attempt: QuizAttempt): Promise<void> {
    await this.prisma.quizAttempt.update({
      where: { id: attempt.id },
      data: {
        submittedAt: attempt.submittedAt,
        totalPoints: attempt.totalPoints,
        updatedAt: attempt.updatedAt,
      },
    });
  }

  async submit(data: SubmitQuizAttemptData): Promise<void> {
    await this.prisma.quizAttempt.update({
      where: { id: data.attemptId },
      data: {
        submittedAt: data.submittedAt,
        totalPoints: data.totalPoints,
        updatedAt: new Date(),
        answers: {
          create: data.answers.map((a: QuizAttemptRecord) => ({
            id: a.id,
            questionId: a.questionId,
            answer: a.answer,
            earnedPoints: a.earnedPoints,
            selectedOptions: a.selectedOptions.length > 0
              ? {
                  create: a.selectedOptions.map((optionId: number) => ({ optionId })),
                }
              : undefined,
          })),
        },
      },
    });
  }

  private toDomain(record: QuizAttemptRecord): QuizAttempt {
    return QuizAttempt.restore({
      id: record.id,
      quizId: record.quizId,
      lessonId: record.lessonId,
      clientId: record.clientId,
      startedAt: record.startedAt,
      submittedAt: record.submittedAt,
      totalPoints: record.totalPoints,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}