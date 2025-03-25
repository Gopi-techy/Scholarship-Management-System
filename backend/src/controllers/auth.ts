import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase';
import { AppError } from '../utils/error';
import { AuthRequest } from '../middleware/auth.middleware';
import { AuthService } from '../services/auth.service';

// Register new user
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name
    });

    // Set custom claims for role
    await auth.setCustomUserClaims(userRecord.uid, { role });

    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      name,
      role,
      createdAt: new Date()
    });

    res.status(201).json({
      message: 'User registered successfully',
      userId: userRecord.uid
    });
  } catch (error) {
    next(error);
  }
};

// Login user
export const login = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Note: Actual authentication should be handled on the frontend using Firebase Authentication client SDK
    res.json({
      message: 'Please use Firebase Authentication client SDK for login'
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      throw new AppError('User not found', 404);
    }

    res.json({
      id: userDoc.id,
      ...userDoc.data()
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { name, email } = req.body;
    const updates: Record<string, any> = {};

    if (name) {
      updates.name = name;
      await auth.updateUser(req.user.uid, { displayName: name });
    }

    if (email) {
      updates.email = email;
      await auth.updateUser(req.user.uid, { email });
    }

    if (Object.keys(updates).length > 0) {
      await db.collection('users').doc(req.user.uid).update(updates);
    }

    res.json({
      message: 'Profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Logout user
export const logout = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Note: Actual logout should be handled on the frontend
    res.json({
      message: 'Please use Firebase Authentication client SDK for logout'
    });
  } catch (error) {
    next(error);
  }
};

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, user } = await AuthService.login(req.body);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  static async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie('token');
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }
} 