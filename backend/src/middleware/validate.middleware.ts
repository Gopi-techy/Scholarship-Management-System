import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { AppError } from '../utils/error';

export const validateSchema = (schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      if (error.isJoi) {
        const errors = error.details.map((detail: any) => detail.message);
        next(new AppError('Validation error', 400, errors));
      } else {
        next(error);
      }
    }
  };
}; 