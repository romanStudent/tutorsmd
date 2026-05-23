import { ITutorRepository } from '../../../domain/repositories/ITutorRepository';

import { NotFoundError } from '../../../domain/errors/NotFoundError';

export interface UpdateTutorProfileDto {
  tutorId: string;

  nameDe?: string | null;
  nameRu?: string | null;

  surnameDe?: string | null;
  surnameRu?: string | null;

  highlightDe?: string | null;
  highlightRu?: string | null;

  fulldescribeDe?: string | null;
  fulldescribeRu?: string | null;

  hourlyRate?: number | null;
}

export class UpdateTutorProfileUseCase {
  constructor(
    private readonly tutorRepo: ITutorRepository,
  ) {}

  async execute(dto: UpdateTutorProfileDto): Promise<void> {
    const tutor = await this.tutorRepo.findById(dto.tutorId);

    if (!tutor) {
      throw new NotFoundError('Tutor not found');
    }

    const updated = tutor.update({
      nameDe: dto.nameDe,
      nameRu: dto.nameRu,

      surnameDe: dto.surnameDe,
      surnameRu: dto.surnameRu,

      highlightDe: dto.highlightDe,
      highlightRu: dto.highlightRu,

      fulldescribeDe: dto.fulldescribeDe,
      fulldescribeRu: dto.fulldescribeRu,

      hourlyRate: dto.hourlyRate,
    });

    await this.tutorRepo.save(updated);
  }
}