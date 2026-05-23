import { Request, Response } from 'express';

import { ITutorController } from './ITutorController';

import { GetTutorProfileUseCase } from '../../../application/usecases/tutor/GetTutorProfileUseCase';
import { UpdateTutorProfileUseCase } from '../../../application/usecases/tutor/UpdateTutorProfileUseCase';
import { GetPendingTutorsUseCase } from '../../../application/usecases/tutor/GetPendingTutorUseCase';
import { ApproveTutorUseCase } from '../../../application/usecases/tutor/ApproveTutorUseCase';
import { RejectTutorUseCase } from '../../../application/usecases/tutor/RejectTutorUseCase';

import {
  UpdateTutorProfileDto,
  RejectTutorDto,
  
} from './tutor.schema';

type TutorIdParams = {
  tutorId: string;
};

export class TutorController implements ITutorController {
  constructor(
    private readonly getProfileUseCase: GetTutorProfileUseCase,
    private readonly updateProfileUseCase: UpdateTutorProfileUseCase,
    private readonly getPendingTutorsUseCase: GetPendingTutorsUseCase,
    private readonly approveTutorUseCase: ApproveTutorUseCase,
    private readonly rejectTutorUseCase: RejectTutorUseCase,
  ) {}

  // GET /tutors/:tutorId
  async getProfile(
    req: Request<TutorIdParams>,
    res: Response,
  ): Promise<void> {
    const { tutorId } = req.params;

    const profile = await this.getProfileUseCase.execute(
      tutorId,
    );

    res.status(200).json({
      profile,
    });
  }

  // PATCH /tutors/me
  async updateProfile(
    req: Request<{}, {}, UpdateTutorProfileDto>,
    res: Response,
  ): Promise<void> {
    const tutorId = req.user!.profileId;

    const {
      nameDe,
      nameRu,
      surnameDe,
      surnameRu,
      highlightDe,
      highlightRu,
      fulldescribeDe,
      fulldescribeRu,
      hourlyRate,
    } = req.body;

    await this.updateProfileUseCase.execute({
      tutorId,
      nameDe,
      nameRu,
      surnameDe,
      surnameRu,
      highlightDe,
      highlightRu,
      fulldescribeDe,
      fulldescribeRu,
      hourlyRate,
    });

    res.status(200).json({
      message: 'Profile updated.',
    });
  }

  // GET /admin/tutors/pending
  async getPendingTutors(
    req: Request,
    res: Response,
  ): Promise<void> {
    const tutors =
      await this.getPendingTutorsUseCase.execute();

    res.status(200).json({
      tutors,
    });
  }

  // POST /admin/tutors/:tutorId/approve
  async approve(
    req: Request<TutorIdParams>,
    res: Response,
  ): Promise<void> {
    const adminUserId = req.user!.userId;

    const { tutorId } = req.params;

    await this.approveTutorUseCase.execute({
      tutorId,
      adminUserId,
    });

    res.status(200).json({
      message: 'Tutor approved.',
    });
  }

  // POST /admin/tutors/:tutorId/reject
  async reject(
    req: Request<
      TutorIdParams,
      {},
      RejectTutorDto
    >,
    res: Response,
  ): Promise<void> {
    const { tutorId } = req.params;
    const { reason } = req.body;

    await this.rejectTutorUseCase.execute({
      tutorId,
      reason,
    });

    res.status(200).json({
      message: 'Tutor rejected.',
    });
  }
}