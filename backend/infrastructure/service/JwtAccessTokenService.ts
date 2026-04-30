// infrastructure/security/JwtTokenService.ts

import jwt from 'jsonwebtoken';
import { IAccessTokenService } from '../../application/ports/IAccessTokenService';
import { AccessTokenPayload } from '../../domain/value-objects/AccessToken';

export class JwtAccessTokenService implements IAccessTokenService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) throw new Error('JWT_ACCESS_SECRET env variable is required');
    this.secret = secret;
    this.expiresIn = process.env.JWT_ACCESS_EXPIRES_IN ?? '15m';
  }

  generateAccessToken(payload: AccessTokenPayload): string {
    return jwt.sign(
      { userId: payload.userId, activeRole: payload.activeRole },
      this.secret,
      { expiresIn: this.expiresIn }
    );
  }

  verifyAccessToken(token: string): AccessTokenPayload | null {
    try {
      return jwt.verify(token, this.secret) as AccessTokenPayload;
    } catch {
      return null;
    }
  }
}