import { IAppealRepository } from '../../../domain/repositories/IAppealRepository';
import { AdminId, AppealId } from '../../../domain/value-objects/EntityId';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { DomainError } from '../../../domain/errors/DomainError';
import { AppealDto } from '../../dto/appeal/AppealDto';

export class RejectAppealUseCase {
  constructor(
    private readonly appealRepo: IAppealRepository,
  ) {}

  async execute(dto: AppealDto): Promise<void> {
    const appealId = new AppealId(dto.appealId);
    new AdminId(dto.adminId);

    const appeal = await this.appealRepo.findById(appealId.value);
    if (!appeal) throw new NotFoundError('Appeal not found');

    if (appeal.status !== 'open') {
      throw new DomainError(`Cannot reject appeal with status: ${appeal.status}`);
    }

    await this.appealRepo.reject(appealId.value, dto.adminId);
  }
}