// Для тьютора — все слоты включая деактивированные
import { IAvailableSlotRepository } from '../../../domain/repositories/IAvailableSlotRepository';
import { TutorId } from '../../../domain/value-objects/EntityId';
import { DomainError } from '../../../domain/errors/DomainError';

export interface OwnSlotResult {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface GetTutorOwnSlotsDto {
  tutorId: string;        // владелец слотов
  requestedByTutorId: string; // кто запрашивает — должен совпадать
}

export class GetTutorOwnSlotsUseCase {
  constructor(
    private readonly slotRepo: IAvailableSlotRepository,
  ) {}

  async execute(dto: GetTutorOwnSlotsDto): Promise<OwnSlotResult[]> {
    const tutorId = new TutorId(dto.tutorId);
    const requestedBy = new TutorId(dto.requestedByTutorId);

    // Тьютор может видеть только свои слоты
    if (tutorId.value !== requestedBy.value) {
      throw new DomainError('You can only view your own slots');
    }

    const slots = await this.slotRepo.findByTutorId(tutorId.value, false);

    return slots.map(s => ({
      id: s.id,
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
      isActive: s.isActive,
    }));
  }
}