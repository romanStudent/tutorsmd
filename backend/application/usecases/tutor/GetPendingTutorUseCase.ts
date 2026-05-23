import { ITutorRepository, PendingTutorResult } from '../../../domain/repositories/ITutorRepository';

export class GetPendingTutorsUseCase {
  constructor(
    private readonly tutorRepo: ITutorRepository,
  ) {}

  async execute(): Promise<PendingTutorResult[]> {
    return this.tutorRepo.findPendingWithUser();
  }
}