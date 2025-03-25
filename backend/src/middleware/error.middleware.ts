import { Request, Response } from 'express';
import { AppError } from '../utils/error';

export const errorHandler = (
  error: Error | AppError,
  _req: Request,
  res: Response
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });
    return;
  }

  // Handle unexpected errors
  console.error('Unexpected error:', error);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
}; 