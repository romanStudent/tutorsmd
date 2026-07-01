import { NextFunction, Request, Response } from 'express';

export const wrap = 
<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
>(
  fn: (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>) => Promise<void> | void,
) => {
  return (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response<ResBody>, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
};