import { AvailableSlot } from '../../../domain/entities/AvailableSlot';
import { IAvailableSlotRepository } from '../../../domain/repositories/IAvailableSlotRepository';
import { ITutorRepository } from '../../../domain/repositories/ITutorRepository';
import { IUUIDGenerator } from '../../ports/IUUIDGenerator';
import { TutorId, AvailableSlotId } from '../../../domain/value-objects/EntityId';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { DomainError } from '../../../domain/errors/DomainError';
import { ConflictError } from '../../../domain/errors/ConflictError';

export interface CreateAvailableSlotDto {
  tutorId: string;
  dayOfWeek: number;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
}

export interface CreateAvailableSlotResult {
  slotId: string;
}

export class CreateAvailableSlotUseCase {
  constructor(
    private readonly slotRepo: IAvailableSlotRepository,
    private readonly tutorRepo: ITutorRepository,
    private readonly idGenerator: IUUIDGenerator,
  ) {}

  async execute(dto: CreateAvailableSlotDto): Promise<CreateAvailableSlotResult> {
    const tutorId = new TutorId(dto.tutorId);
    const slotId = new AvailableSlotId(this.idGenerator.generate());

    // 1. Тьютор существует и одобрен
    const tutor = await this.tutorRepo.findById(tutorId.value);
    if (!tutor) throw new NotFoundError('Tutor not found');
    if (!tutor.isApproved) throw new DomainError('Tutor is not approved');

    // 2. Проверяем конфликт с существующими слотами
    // @@unique([tutorId, dayOfWeek, startTime]) в БД — финальная защита
    const hasConflict = await this.slotRepo.existsConflict(
      tutorId.value,
      dto.dayOfWeek,
      dto.startTime,
      dto.endTime,
    );
    if (hasConflict) {
      throw new ConflictError('Slot overlaps with existing availability');
    }

    // 3. Создаём слот — entity валидирует формат времени и длительность
    const slot = AvailableSlot.create({
      id: slotId.value,
      tutorId: tutorId.value,
      dayOfWeek: dto.dayOfWeek,
      startTime: dto.startTime,
      endTime: dto.endTime,
    });

    await this.slotRepo.create(slot);

    return { slotId: slot.id };
  }
}