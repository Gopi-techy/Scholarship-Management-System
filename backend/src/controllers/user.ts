import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { AppError } from '../utils/error';

export class UserController {
  static async getUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getUsers();
      res.json({ users });
    } catch (error) {
      next(error);
    }
  }

  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUser(req.params.id);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.deleteUser(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async updateFcmToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { fcmToken } = req.body;
      if (!fcmToken) {
        throw new AppError('FCM token is required', 400);
      }
      await UserService.updateFcmToken(req.params.id, fcmToken);
      res.json({ message: 'FCM token updated successfully' });
    } catch (error) {
      next(error);
    }
  }
} 