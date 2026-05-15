// Для студентов — только активные слоты тьютора
import { IAvailableSlotRepository } from '../../../domain/repositories/IAvailableSlotRepository';
import { TutorId } from '../../../domain/value-objects/EntityId';

export interface PublicSlotResult {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export class GetTutorPublicSlotsUseCase {
  constructor(
    private readonly slotRepo: IAvailableSlotRepository,
  ) {}

  async execute(tutorId: string): Promise<PublicSlotResult[]> {
    const id = new TutorId(tutorId);

    const slots = await this.slotRepo.findByTutorId(id.value, true);

    return slots.map(s => ({
      id: s.id,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
    }));
  }
}