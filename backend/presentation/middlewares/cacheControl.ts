import { Request, Response, NextFunction } from 'express';

export const privateNoCache = (_req: Request, res: Response, next: NextFunction): void => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  next();
};

export const publicYesCache = (maxAgeSeconds: number) =>
  (_req: Request, res: Response, next: NextFunction): void => {
    res.set('Cache-Control', `public, max-age=${maxAgeSeconds}, stale-while-revalidate=30`);
    next();
  };