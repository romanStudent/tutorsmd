import { PrismaClient } from '../../../../generated/prisma';
import { IQuizQuestionRepository, CreateQuizQuestionData, QuizQuestionRecord } from '../../../../domain/repositories/quiz/IQuizQuestionRepository';
import { QuestionType } from '../../../../domain/entities/quiz/Quiz';
 
export class PrismaQuizQuestionRepository implements IQuizQuestionRepository {
  constructor(private readonly prisma: PrismaClient) {}

    async findById(id: string): Promise<QuizQuestionRecord | null> {
    const record = await this.prisma.quizQuestion.findUnique({
      where: { id },
      select: { id: true, quizId: true, question: true, type: true, order: true, maxPoints: true },
    });
    if (!record) return null;
    return {
      id: record.id,
      quizId: record.quizId,
      question: record.question,
      type: record.type as QuestionType,
      order: record.order,
      maxPoints: record.maxPoints,
    };
  }
 
  async findByQuizId(quizId: string): Promise<QuizQuestionRecord[]> {
    const records = await this.prisma.quizQuestion.findMany({
      where: { quizId },
      orderBy: { order: 'asc' },
      select: { id: true, quizId: true, question: true, type: true, order: true, maxPoints: true },
    });
    return records.map((r: QuizQuestionRecord)  => ({
      id: r.id,
      quizId: r.quizId,
      question: r.question,
      type: r.type as QuestionType,
      order: r.order,
      maxPoints: r.maxPoints,
    }));
  }
  async getMaxOrder(quizId: string): Promise<number> {
    const result = await this.prisma.quizQuestion.aggregate({
      where: { quizId },
      _max: { order: true },
    });
    return result._max.order ?? 0;
  }

  async create(data: CreateQuizQuestionData): Promise<void> {
    await this.prisma.quizQuestion.create({
      data: {
        id: data.id,
        quizId: data.quizId,
        question: data.question,
        type: data.type,
        order: data.order,
        maxPoints: data.maxPoints,
        options: {
          create: data.options.map(o => ({
            id: o.id,
            text: o.text,
            isCorrect: o.isCorrect,
          })),
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.quizQuestion.delete({ where: { id } });
  }
}