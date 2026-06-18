export interface IPasswordHasher {
  hash(plain: string): Promise<string>;
  compare(plain: string, passwordHash: string): Promise<boolean>;
}