/**
 * mockServices.ts
 * Моки внешних сервисов. Email-сервис мокаем всегда —
 * не хотим слать реальные письма в тестах.
 */

export interface SentEmail {
  to: string;
  link: string;
  type: 'activation' | 'passwordReset' | 'emailChange';
  languageCode?: string;
}

/**
 * In-memory email сервис. Перехватывает все письма.
 * После каждого теста вызывай mockEmailService.clear().
 */
export class MockEmailService {
  private _sent: SentEmail[] = [];

  get sent(): SentEmail[] {
    return this._sent;
  }

  get lastSent(): SentEmail | undefined {
    return this._sent[this._sent.length - 1];
  }

  clear() {
    this._sent = [];
  }

  async sendActivationLink(email: string, link: string, languageCode?: string): Promise<void> {
    this._sent.push({ to: email, link, type: 'activation', languageCode });
  }

  async sendPasswordResetLink(email: string, link: string, languageCode?: string): Promise<void> {
    this._sent.push({ to: email, link, type: 'passwordReset', languageCode });
  }

  async sendEmailChangeConfirmation(email: string, link: string, languageCode?: string): Promise<void> {
    this._sent.push({ to: email, link, type: 'emailChange', languageCode });
  }

  async sendLessonReminder(..._args: any[]): Promise<void> {}

  /** Извлечь raw token из ссылки вида /activate/TOKEN или /password/reset/TOKEN */
  extractToken(link: string): string {
    const parts = link.split('/');
    return parts[parts.length - 1];
  }
}