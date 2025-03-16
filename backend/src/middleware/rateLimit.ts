import rateLimit from 'express-rate-limit';
import { AppError } from './errorHandler';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  handler: (req, res, next, options) => {
    next(new AppError(options.message, 429));
  },
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login requests per hour
  message: 'Too many login attempts from this IP, please try again later',
  handler: (req, res, next, options) => {
    next(new AppError(options.message, 429));
  },
}); 