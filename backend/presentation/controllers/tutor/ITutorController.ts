import { Request, Response } from 'express';

export interface ITutorController {
  getProfile(req: Request, res: Response): Promise<void>;
  updateProfile(req: Request, res: Response): Promise<void>;

  getPendingTutors(req: Request, res: Response): Promise<void>;
  approve(req: Request, res: Response): Promise<void>;
  reject(req: Request, res: Response): Promise<void>;
}