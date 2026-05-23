import { IAppealRepository, AppealRecord } from '../../../domain/repositories/IAppealRepository';
import { LessonId } from '../../../domain/value-objects/EntityId';
import { GetAppealsDto } from '../../dto/appeal/GetAppealsDto';

export class GetAppealsUseCase {
  constructor(
    private readonly appealRepo: IAppealRepository,
  ) {}

  async execute(dto: GetAppealsDto): Promise<AppealRecord[]> {
    if (dto.lessonId) {
      const lessonId = new LessonId(dto.lessonId);
      return this.appealRepo.findByLessonId(lessonId.value);
    }

    if (dto.onlyOpen) {
      return this.appealRepo.findAllOpen();
    }

    if (dto.all) {
        return this.appealRepo.findAll();
    }

    return this.appealRepo.findAllOpen();
  }
}