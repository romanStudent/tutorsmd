import { ITutorRepository } from '../../../domain/repositories/ITutorRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { IEmailService } from '../../ports/IEmailService';
import { NotFoundError } from '../../../domain/errors/NotFoundError';

export interface ApproveTutorDto {
  tutorId: string;
  adminUserId: string; 
}

export class ApproveTutorUseCase {
  constructor(
    private readonly tutorRepo: ITutorRepository,
    private readonly userRepo: IUserRepository,
    private readonly emailService: IEmailService,
  ) {}

  async execute(dto: ApproveTutorDto): Promise<void> {
    // 1. Найти тьютора
    const tutor = await this.tutorRepo.findById(dto.tutorId);
    if (!tutor) throw new NotFoundError('Tutor not found');

    // 2. Approve через domain method — бросит DomainError если уже approved
    const approved = tutor.approve(dto.adminUserId);
    await this.tutorRepo.save(approved);

    // 3. Уведомить тьютора — вне транзакции
    const user = await this.userRepo.findById(tutor.userId);
    if (user) {
      await this.emailService.sendTutorApproved(user.email, user.languageCode);
    }
  }
}