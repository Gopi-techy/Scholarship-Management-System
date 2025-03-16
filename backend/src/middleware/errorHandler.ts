import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Handle MongoDB validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid input data',
      errors: err.message,
    });
  }

  // Handle MongoDB duplicate key errors
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    return res.status(400).json({
      status: 'fail',
      message: `Duplicate ${field}. Please use another value.`,
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token. Please log in again.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Your token has expired. Please log in again.',
    });
  }

  // Handle multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Handle Azure Storage errors
  if (err.message.includes('Azure')) {
    return res.status(500).json({
      status: 'error',
      message: 'Error with file storage service. Please try again later.',
    });
  }

  // Handle Firebase Admin errors
  if (err.message.includes('Firebase')) {
    return res.status(500).json({
      status: 'error',
      message: 'Authentication service error. Please try again later.',
    });
  }

  // Handle all other errors
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong',
  });
}; 