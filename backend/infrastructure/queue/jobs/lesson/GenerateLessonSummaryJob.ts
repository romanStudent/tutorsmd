import { PrismaClient } from '@prisma/client';
import { ILessonSummaryService } from '../../../../application/ports/ILessonSummaryService';

export class GenerateLessonSummaryJob {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly summaryService: ILessonSummaryService,
  ) {}

  async run(payload: { lessonId: string }): Promise<void> {
    const messages = await this.prisma.lessonMessage.findMany({
      where:   { lessonId: payload.lessonId },
      orderBy: { createdAt: 'asc' },
      select:  { senderRole: true, text: true },
    });

    const textMessages = messages.filter(m => m.text);
    if (textMessages.length === 0) return;

    const transcript = textMessages
      .map(m => `[${m.senderRole}]: ${m.text}`)
      .join('\n');

    const content = await this.summaryService.generateSummary(transcript);

    await this.prisma.lessonSummary.upsert({
      where:  { lessonId: payload.lessonId },
      create: { lessonId: payload.lessonId, content, model: 'claude-opus-4-8' },
      update: { content },
    });
  }
}