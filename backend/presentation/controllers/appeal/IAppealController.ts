import { Request, Response } from 'express';

export interface IAppealController {
  create(req: Request, res: Response): Promise<void>;
  getAll(req: Request, res: Response): Promise<void>;
  resolve(req: Request, res: Response): Promise<void>;
  reject(req: Request, res: Response): Promise<void>;
}