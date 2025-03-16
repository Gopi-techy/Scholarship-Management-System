import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';
import { authenticate } from '../middleware/auth';

const router = Router();

// Register new user
router.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, name, role, phone } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new AppError('User already exists', 400);
      }

      // Create new user
      const user = new User({
        email,
        password,
        name,
        role: role || 'student',
      });

      if (phone) user.phone = phone;

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      logger.info(`New user registered: ${email}`);

      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Login user
router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new AppError('Invalid credentials', 401);
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      logger.info(`User logged in: ${email}`);

      res.json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get current user
router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.patch(
  '/profile',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, phone } = req.body;
      const user = await User.findById(req.user?.userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (name) user.name = name;
      if (phone) user.phone = phone;

      await user.save();

      res.json({
        status: 'success',
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router; 