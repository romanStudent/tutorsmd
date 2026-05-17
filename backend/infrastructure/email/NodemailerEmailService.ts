import { IEmailService } from '../../application/ports/IEmailService';
import { LanguageCode } from '../../domain/entities/User';
import { NodemailerTransport } from './NodemailerTransport';
import { EmailTemplates } from './EmailTemplates';
import { DomainError } from '../../domain/errors/DomainError';

export class NodemailerEmailService implements IEmailService {
  private async send(to: string, subject: string, html: string): Promise<void> {
    try {
      await NodemailerTransport.get().sendMail({
        from: `"TutorsMD" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
    } catch (e) {
      console.error('Nodemailer Error:', e);
      throw new DomainError('Failed to send email');
    }
  }

  async sendActivationLink(
    email: string,
    link: string,
    language?: LanguageCode,
  ): Promise<void> {
    const { subject, html } = EmailTemplates.activation(link, language);
    await this.send(email, subject, html);
  }

  async sendPasswordResetLink(
    email: string,
    link: string,
    language?: LanguageCode,
  ): Promise<void> {
    const { subject, html } = EmailTemplates.passwordReset(link, language);
    await this.send(email, subject, html);
  }

  async sendEmailChangeConfirmation(
    email: string,
    link: string,
    language?: LanguageCode,
  ): Promise<void> {
    const { subject, html } = EmailTemplates.emailChange(link, language);
    await this.send(email, subject, html);
  }

  async sendLessonReminder(
    email: string,
    time: string,
    language?: LanguageCode,
  ): Promise<void> {
    const { subject, html } = EmailTemplates.lessonReminder(time, String(language));
    await this.send(email, subject, html);
  }

  async sendTutorApproved(
    email: string,
    language?: LanguageCode,
  ): Promise<void> {
    const { subject, html } = EmailTemplates.tutorApproved(language);
    await this.send(email, subject, html);
  }

  async sendTutorRejected(
    email: string,
    language?: LanguageCode,
  ): Promise<void> {
    const { subject, html } = EmailTemplates.tutorRejected(language);
    await this.send(email, subject, html);
  }
}