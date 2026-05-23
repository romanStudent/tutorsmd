import { ITutorRepository } from '../../../domain/repositories/ITutorRepository';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { DomainError } from '../../../domain/errors/DomainError';

export interface TutorProfileResult {
  id: string;
  userId: string;
  nameDe: string | null;
  nameRu: string | null;
  surnameDe: string | null;
  surnameRu: string | null;
  highlightDe: string | null;
  highlightRu: string | null;
  fulldescribeDe: string | null;
  fulldescribeRu: string | null;
  hourlyRate: number | null;
  ratingAvg: number;
  ratingCount: number;
  approvalStatus: string;
}

export class GetTutorProfileUseCase {
  constructor(
    private readonly tutorRepo: ITutorRepository,
  ) {}

  async execute(tutorId: string): Promise<TutorProfileResult> {
    const tutor = await this.tutorRepo.findById(tutorId);
    if (!tutor) throw new NotFoundError('Tutor not found');

    // Публичный профиль — только approved тьюторы видны клиентам
    if (!tutor.isApproved) {
      throw new DomainError('Tutor profile is not available');
    }

    return {
      id: tutor.id,
      userId: tutor.userId,
      nameDe: tutor.nameDe,
      nameRu: tutor.nameRu,
      surnameDe: tutor.surnameDe,
      surnameRu: tutor.surnameRu,
      highlightDe: tutor.highlightDe,
      highlightRu: tutor.highlightRu,
      fulldescribeDe: tutor.fulldescribeDe,
      fulldescribeRu: tutor.fulldescribeRu,
      hourlyRate: tutor.hourlyRate,
      ratingAvg: tutor.ratingAvg,
      ratingCount: tutor.ratingCount,
      approvalStatus: tutor.approvalStatus,
    };
  }
}