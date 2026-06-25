import { NotFoundError } from "../../../../domain/errors/NotFoundError";
import { ConflictError } from "../../../../domain/errors/ConflictError";
import { DomainError } from "../../../../domain/errors/DomainError";
import { IEmailChangeRepository } from "../../../../domain/repositories/email/IEmailChangeRepository";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import { IEmailChangeTokenFactory } from "../../../ports/email/IEmailChangeTokenFactory";
import { IUnitOfWork } from "../../../ports/IUnitOfWork";
import { IRefreshTokenRepository } from "../../../../domain/repositories/IRefreshTokenRepository";

export class ConfirmOldEmailChangeUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly emailChangeRepo: IEmailChangeRepository,
    private readonly refreshTokenRepo: IRefreshTokenRepository,
    private readonly tokenFactory: IEmailChangeTokenFactory,
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(rawToken: string): Promise<void> {
    const oldConfirmHash = this.tokenFactory.hashRaw(rawToken);

    await this.unitOfWork.run(async () => {
      const record = await this.emailChangeRepo.confirmOldEmail(oldConfirmHash);
      if (!record) throw new DomainError('Invalid or expired link');

      if (record.expiresAt < new Date()) {
        await this.emailChangeRepo.deleteByUserId(record.userId);
        throw new DomainError('Link expired. Please request email change again.');
      }

      // Если новый email уже тоже подтверждён - применяем смену
      if (record.newEmailConfirmed) {
        const user = await this.userRepo.findById(record.userId);
        if (!user) throw new NotFoundError('User not found');

        const updatedUser = user.changeEmail(record.newEmail);

        try {
          await this.userRepo.save(updatedUser);
          await this.emailChangeRepo.deleteByUserId(record.userId);
          await this.refreshTokenRepo.revokeAllByUserId(record.userId);
        } catch (err: any) {
          if (err?.code === 'P2002') {
            throw new ConflictError('Email already taken.');
          }
          throw err;
        }
      }
      // Если новый email ещё не подтверждён - просто ждём
    });
  }
}