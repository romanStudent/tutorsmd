import { Request, Response, NextFunction } from 'express';
import { Role } from '../../../domain/entities/User';

// Middleware — проверяет activeRole из JWT
// Использовать ПОСЛЕ requireAuth
export const requireRole = (role: Role) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.activeRole !== role) {
      res.status(403).json({ message: `Forbidden: requires role '${role}'` });
      return;
    }
    next();
  };