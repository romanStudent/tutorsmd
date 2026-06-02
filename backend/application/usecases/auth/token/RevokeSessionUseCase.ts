import { DomainError } from "../../../../domain/errors/DomainError";
import { ForbiddenError } from "../../../../domain/errors/ForbiddenError";
import { NotFoundError } from "../../../../domain/errors/NotFoundError";
import { IRefreshTokenRepository } from "../../../../domain/repositories/IRefreshTokenRepository";
import { appEvents, AppEvents }    from "../../../../infrastructure/events/AppEventEmitter";

export class RevokeSessionUseCase {
  constructor(
    private readonly refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  async execute(userId: string, tokenHash: string): Promise<void> {
    const session = await this.refreshTokenRepo.findByTokenHash(tokenHash);

    if (!session) {
      throw new NotFoundError('Session not found');
    }

    if (session.userId !== userId) throw new ForbiddenError('Access denied');

    if (session.revokedAt) {
      throw new DomainError('Session already revoked');
    }

    await this.refreshTokenRepo.revoke(tokenHash);
    // Уведомить WebSocket -> устройство с этой сессией должно разлогиниться
    appEvents.emit(AppEvents.SESSION_REVOKED, userId);
  }
}