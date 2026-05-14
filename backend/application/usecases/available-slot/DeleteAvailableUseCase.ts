// application/usecases/availability/DeleteAvailableSlotUseCase.ts
import { IAvailableSlotRepository } from '../../../domain/repositories/IAvailableSlotRepository';
import { TutorId, AvailableSlotId } from '../../../domain/value-objects/EntityId';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { DomainError } from '../../../domain/errors/DomainError';

export interface DeleteAvailableSlotDto {
  slotId: string;
  tutorId: string;
}

export class DeleteAvailableSlotUseCase {
  constructor(
    private readonly slotRepo: IAvailableSlotRepository,
  ) {}

  async execute(dto: DeleteAvailableSlotDto): Promise<void> {
    const slotId = new AvailableSlotId(dto.slotId);
    const tutorId = new TutorId(dto.tutorId);

    const slot = await this.slotRepo.findById(slotId.value);
    if (!slot) throw new NotFoundError('Slot not found');

    if (slot.tutorId !== tutorId.value) {
      throw new DomainError('You are not the owner of this slot');
    }

    await this.slotRepo.delete(slotId.value);
  }
}