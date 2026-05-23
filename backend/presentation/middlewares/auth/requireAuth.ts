/*
import { NextFunction, Request, Response, RequestHandler } from "express";
import { IAccessTokenFactory } from "../../application/ports/token/IAccessTokenFactory";
import ApiError from "../../domain/errors/apiError";
import { Role } from '../../domain/entities/User';

export const requireAuth = (accessTokenFactory: IAccessTokenFactory): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return next(ApiError.Unauthorized("No valid AccessToken"));
    }

    const accessToken = authHeader.split(" ")[1];
    const userData = accessTokenFactory.verify(accessToken);

    if (!userData) {
      return next(ApiError.Unauthorized("Invalid AccessToken"));
    }

    req.user = userData; 
    return next();
  } catch {
    return next(ApiError.Unauthorized("Session not found"));
  }
}
};

export const requireRole = (role: Role) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.activeRole !== role) {
      return next(ApiError.Unauthorized("Invalid Role"));
    }
    next();
};
*/



import { Request, Response, NextFunction } from 'express';
import { accessTokenFactory } from '../../../di/container';

// Middleware — проверяет Bearer токен и кладёт payload в req.user
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No valid access token' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = accessTokenFactory.verify(token);

    if (!payload) {
      res.status(401).json({ message: 'Invalid or expired access token' });
      return;
    }

    req.user = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
};