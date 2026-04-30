import { IPasswordHasher } from '../../application/ports/IPasswordHasher';

// bcrypt обрезает слишком длинные пароли
// import bcrypt from 'bcrypt';

import argon2 from 'argon2';

export class ArgonPasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64MB
      timeCost: 3,
      parallelism: 4,
    });
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, plain);
  }
}