export interface EmailChangeRecord {
  id:        string;
  userId:    string;
  newEmail:  string;
  newEmailConfirmed: boolean;
  oldEmailConfirmed: boolean;
  expiresAt: Date;
  createdAt: Date;
}

export interface IEmailChangeRepository {
  upsert(data: { userId: string; newEmail: string; tokenHash: string; oldConfirmHash: string; cancelHash: string; expiresAt: Date }): Promise<void>;
  
  // Подтверждение с нового email
  consumeToken(tokenHash: string): Promise<EmailChangeRecord | null>;

  // Подтверждение со старого email - не удаляет запись, только ставит флаг
  confirmOldEmail(oldConfirmHash: string): Promise<EmailChangeRecord | null>;

  // Отмена - удаляет запись
  consumeCancelToken(cancelHash: string): Promise<EmailChangeRecord | null>;

  // Применить смену если оба подтверждены
  findConfirmedBoth(userId: string): Promise<EmailChangeRecord | null>;

  deleteByUserId(userId: string): Promise<void>;
}