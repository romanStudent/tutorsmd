import { RegularSchedule } from '../../entities/RegularSchedule';

export interface IRegularScheduleRepository {
  findById(id: string): Promise<RegularSchedule | null>;
  findByClientAndTutor(clientId: string, tutorId: string): Promise<RegularSchedule[]>;
  findActiveByTutor(tutorId: string): Promise<RegularSchedule[]>;
  findActiveByClient(clientId: string): Promise<RegularSchedule[]>;

  create(schedule: RegularSchedule): Promise<void>;
  save(schedule: RegularSchedule): Promise<void>;
}