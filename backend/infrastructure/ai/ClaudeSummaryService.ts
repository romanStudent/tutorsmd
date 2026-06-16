import { anthropic } from "./AnthropicClient";
import { ILessonSummaryService } from '../../application/ports/ILessonSummaryService';

export class ClaudeSummaryService implements ILessonSummaryService {
  constructor(private readonly client: typeof anthropic) {}

  async generateSummary(transcript: string): Promise<string> {
    const response = await this.client.messages.create({
      model:      'claude-opus-4-8',
      max_tokens: 1024,
      thinking:   { type: 'adaptive' },
      system: `You are an educational assistant. Summarize tutoring lesson chat transcripts.
Output in the same language as the transcript.
Format: markdown with sections: ## Topics Covered, ## Key Points, ## Homework (if any).`,
      messages: [{ role: 'user', content: transcript }],
    });

    return response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n');
  }
}