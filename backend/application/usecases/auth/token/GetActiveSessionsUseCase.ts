import { IRefreshTokenRepository } from "../../../../domain/repositories/IRefreshTokenRepository";
import { IRefreshTokenFactory } from "../../../ports/token/IRefreshTokenFactory";


export interface SessionDto {
  tokenHash: string;
  deviceInfo: string | null;
  createdAt: Date;
  expiresAt: Date;
}


export class GetActiveSessionsUseCase {
  constructor(
    private readonly refreshTokenRepo: IRefreshTokenRepository,
    private readonly refreshTokenFactory: IRefreshTokenFactory
  ) {}

  async execute(userId: string, refreshToken: string): Promise<SessionDto[]> {

    const sessions = await this.refreshTokenRepo.findActiveByUserId(userId);
    const currentHash = this.refreshTokenFactory.fromRaw(refreshToken).hash;
    
    return sessions.map(s => ({
      tokenHash: s.tokenHash,
      deviceInfo: s.deviceInfo,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      isCurrent: s.tokenHash === currentHash
    }));
  }
}