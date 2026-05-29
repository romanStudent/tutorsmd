import { NextFunction, Request, Response, RequestHandler, Router } from 'express';

export const wrap = 
<T extends RequestHandler>
(
  fn: T
): T =>
  { return ((req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  }) as T;
  };