import { AvailableSlot } from '../entities/AvailableSlot';

export interface IAvailableSlotRepository {
  findById(id: string): Promise<AvailableSlot | null>;
  findByTutorId(tutorId: string, onlyActive?: boolean): Promise<AvailableSlot[]>;
  existsConflict(tutorId: string, dayOfWeek: number, startTime: string, endTime: string, excludeId?: string): Promise<boolean>;

  create(slot: AvailableSlot): Promise<void>;
  save(slot: AvailableSlot): Promise<void>;
  delete(id: string): Promise<void>;
}