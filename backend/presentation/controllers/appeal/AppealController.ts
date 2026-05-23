import { Request, Response } from 'express';
import { IAppealController } from './IAppealController';
import { CreateAppealUseCase } from '../../../application/usecases/appeal/CreateAppealUseCase';
import { GetAppealsUseCase } from '../../../application/usecases/appeal/GetAppealUseCase';
import { ResolveAppealUseCase } from '../../../application/usecases/appeal/ResolveAppealUseCase';
import { RejectAppealUseCase } from '../../../application/usecases/appeal/RejectAppealUseCase';

export class AppealController implements IAppealController {
  constructor(
    private readonly createAppealUseCase:  CreateAppealUseCase,
    private readonly getAppealsUseCase:    GetAppealsUseCase,
    private readonly resolveAppealUseCase: ResolveAppealUseCase,
    private readonly rejectAppealUseCase:  RejectAppealUseCase,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const { lessonId, text, expiresAt } = req.body;
    const appellantId   = req.user!.userId;
    const appellantRole = req.user!.activeRole as 'client' | 'tutor';

    const result = await this.createAppealUseCase.execute({
      lessonId,
      appellantId,
      appellantRole,
      text,
      expiresAt: expiresAt ?? null,
    });

    res.status(201).json({ appealId: result.appealId });
  }

  async getAll(req: Request, res: Response): Promise<void> {
    const { lessonId, onlyOpen, all } = req.query;

    const appeals = await this.getAppealsUseCase.execute({
      lessonId:  lessonId  as string | undefined,
      onlyOpen:  onlyOpen  === 'true',
      all:       all       === 'true',
    });

    res.status(200).json({ appeals });
  }

 
  async resolve(req: Request, res: Response): Promise<void> {
    const appealId = req.params.appealId;
    const adminId  = req.user!.userId;

    await this.resolveAppealUseCase.execute({ appealId, adminId });

    res.status(200).json({ message: 'Appeal resolved.' });
  }

  async reject(req: Request, res: Response): Promise<void> {
    const appealId = req.params.appealId;
    const adminId  = req.user!.userId;

    await this.rejectAppealUseCase.execute({ appealId, adminId });

    res.status(200).json({ message: 'Appeal rejected.' });
  }
}