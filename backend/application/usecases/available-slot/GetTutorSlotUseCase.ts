import { IAvailableSlotRepository } from '../../../domain/repositories/IAvailableSlotRepository';
import { TutorId } from '../../../domain/value-objects/EntityId';

export interface SlotResult {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface GetTutorSlotsDto {
  tutorId: string;
  onlyActive?: boolean;
}

export class GetTutorSlotsUseCase {
  constructor(
    private readonly slotRepo: IAvailableSlotRepository,
  ) {}

  async execute(dto: GetTutorSlotsDto): Promise<SlotResult[]> {
    const tutorId = new TutorId(dto.tutorId);

    const slots = await this.slotRepo.findByTutorId(
      tutorId.value,
      dto.onlyActive ?? true,
    );

    return slots.map(s => ({
      id: s.id,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      isActive: s.isActive,
    }));
  }
}