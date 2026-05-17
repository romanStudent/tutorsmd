import { Tutor } from '../entities/Tutor';

export interface PendingTutorResult {
  tutorId: string;
  userId: string;
  name: string;
  surname: string;
  email: string;
  nameDe: string | null;
  surnameDe: string | null;
  nameRu: string | null;
  surnameRu: string | null;
  createdAt: Date;
}

export interface ITutorRepository {
  findById(id: string): Promise<Tutor | null>;
  findByUserId(userId: string): Promise<Tutor | null>;
  findPendingWithUser(): Promise<PendingTutorResult[]>;
  create(tutor: Tutor): Promise<void>;
  save(tutor: Tutor): Promise<void>;
  delete(id: string): Promise<void>;
}