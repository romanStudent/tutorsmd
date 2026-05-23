export type AppealStatus = 'open' | 'resolved' | 'rejected';

export interface AppealRecord {
  id:         string;
  lessonId:   string;          // Проверка, а вообще у клиента был урок?
  clientId:   string | null;
  tutorId:    string | null;
  status:     AppealStatus;
  text:       string;
  resolvedBy: string | null;
  resolvedAt: Date | null;
  expiresAt:  Date | null;
  createdAt:  Date;
}

export interface CreateAppealData {
  id:        string;
  lessonId:  string;
  clientId:  string | null;
  tutorId:   string | null;
  text:      string;
  expiresAt: Date | null;
}

export interface IAppealRepository {
  findById(id: string): Promise<AppealRecord | null>;
  findByLessonId(lessonId: string): Promise<AppealRecord[]>;
  findAllOpen(): Promise<AppealRecord[]>;
  findAll(): Promise<AppealRecord[]>

  create(data: CreateAppealData): Promise<AppealRecord>;
  resolve(id: string, adminId: string): Promise<void>;
  reject(id: string, adminId: string): Promise<void>;
}