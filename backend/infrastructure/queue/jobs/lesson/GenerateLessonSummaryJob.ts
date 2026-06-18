import { PrismaClient } from '@prisma/client';
import { ILessonSummaryService } from '../../../../application/ports/ILessonSummaryService';

export class GenerateLessonSummaryJob {
  constructor(
    private readonly prisma:          PrismaClient,
    private readonly summaryService:  ILessonSummaryService,
  ) {}

  async run(lessonId: string): Promise<void> {
    // Проверяем что саммари ещё нет
    const db: any = this.prisma;
    const existing = await db.lessonSummary.findUnique({
      where: { lessonId },
    });
    if (existing) return;

    const messages = await db.lessonMessage.findMany({
      where:   { lessonId },
      orderBy: { createdAt: 'asc' },
      select:  { senderRole: true, text: true },
    });

    // Нет сообщений — нечего суммаризировать
    if (messages.length === 0) return;

    const transcript = messages
      .filter((m: {text: string}) => m.text)
      .map((m: {senderRole: string, text: string}) => `${m.senderRole}: ${m.text}`)
      .join('\n');

    try {
      const content = await this.summaryService.generateSummary(transcript);

      await db.lessonSummary.create({
        data: {
          lessonId,
          content,
          model: 'claude-opus-4-8',
        },
      });

      console.log(`[LessonSummary] итог для урока ${lessonId} создано.`);
    } catch (err) {
      console.error(`[LessonSummary] итог для урока ${lessonId}:`, err);
    }
  }
}