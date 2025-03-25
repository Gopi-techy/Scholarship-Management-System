import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { AppError } from '../utils/error';

export const authorizeRoles = (allowedRole: string) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      if (req.user.role !== allowedRole && req.user.role !== 'admin') {
        throw new AppError(`Access denied. Role ${allowedRole} required.`, 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}; 