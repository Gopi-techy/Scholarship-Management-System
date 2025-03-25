import { Request, Response, NextFunction } from 'express';
import { auth as firebaseAuth } from '../config/firebase';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    role: string;
  };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await firebaseAuth.verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      role: decodedToken.role || 'student'
    };

    next();
  } catch (error: any) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorizeAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (req.user.role !== 'admin') {
      res.status(403).json({ message: 'Forbidden: Admin access required' });
      return;
    }

    next();
  } catch (error: any) {
    console.error('Authorization error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 