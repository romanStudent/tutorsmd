import { DomainError } from "../../../../domain/errors/DomainError";
import { IEmailChangeRepository } from "../../../../domain/repositories/email/IEmailChangeRepository";
import { IEmailChangeTokenFactory } from "../../../ports/email/IEmailChangeTokenFactory";

export class CancelEmailChangeUseCase {
  constructor(
    private readonly emailChangeRepo: IEmailChangeRepository,
    private readonly tokenFactory: IEmailChangeTokenFactory,
  ) {}

  async execute(rawCancelToken: string): Promise<void> {
    const cancelHash = this.tokenFactory.hashRaw(rawCancelToken);
    const record = await this.emailChangeRepo.consumeCancelToken(cancelHash);

    if (!record) throw new DomainError('Invalid or expired cancel link');
    if (record.expiresAt < new Date()) {
      throw new DomainError('Cancel link expired');
    }
    // Запись уже удалена через consumeCancelToken — смена email отменена
  }
}