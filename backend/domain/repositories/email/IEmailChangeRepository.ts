export interface IEmailChangeRepository {
  upsert(data: { userId: string; newEmail: string; link: string; expiresAt: Date }): Promise<void>;
  findByLink(link: string): Promise<{ userId: string; newEmail: string; expiresAt: Date } | null>;
  deleteByUserId(userId: string): Promise<void>;
}