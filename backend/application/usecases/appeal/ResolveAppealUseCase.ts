import { IAppealRepository } from '../../../domain/repositories/IAppealRepository';
import { AdminId, AppealId } from '../../../domain/value-objects/EntityId';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { DomainError } from '../../../domain/errors/DomainError';
import { AppealDto } from '../../dto/appeal/AppealDto';


export class ResolveAppealUseCase {
  constructor(
    private readonly appealRepo: IAppealRepository,
  ) {}

  async execute(dto: AppealDto): Promise<void> {
    const appealId = new AppealId(dto.appealId);
    
    // middleware проверка, что id РЕАЛЬНО принадлежит админу
    // и в любом случае связь между Admin(в будущем и manager) и Appeal = 1:n. то есть Appeal не модет иметь несколько Admin-s
    new AdminId(dto.adminId);

    const appeal = await this.appealRepo.findById(appealId.value);
    if (!appeal) throw new NotFoundError('Appeal not found');

    if (appeal.status !== 'open') {
      throw new DomainError(`Cannot resolve appeal with status: ${appeal.status}`);
    }

    await this.appealRepo.resolve(appealId.value, dto.adminId);
  }
}