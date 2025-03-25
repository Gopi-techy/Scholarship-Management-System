import { db } from '../config/firebase';
import { AppError } from '../utils/error';
import { logger } from '../utils/logger';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  fcmToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel {
  static async createUser(userData: Omit<UserData, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserData> {
    try {
      const docRef = await db.collection('users').add({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return {
        id: docRef.id,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error creating user:', error);
      throw new AppError('Failed to create user', 500);
    }
  }

  static async getUserById(id: string): Promise<UserData | null> {
    try {
      const doc = await db.collection('users').doc(id).get();
      
      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data()
      } as UserData;
    } catch (error) {
      logger.error('Error getting user:', error);
      throw new AppError('Failed to get user', 500);
    }
  }

  static async updateUser(id: string, userData: Partial<UserData>): Promise<UserData> {
    try {
      const doc = await db.collection('users').doc(id).get();
      
      if (!doc.exists) {
        throw new AppError('User not found', 404);
      }

      await doc.ref.update({
        ...userData,
        updatedAt: new Date()
      });

      return {
        id: doc.id,
        ...doc.data(),
        ...userData,
        updatedAt: new Date()
      } as UserData;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw new AppError('Failed to update user', 500);
    }
  }

  static async deleteUser(id: string): Promise<void> {
    try {
      const doc = await db.collection('users').doc(id).get();
      
      if (!doc.exists) {
        throw new AppError('User not found', 404);
      }

      await doc.ref.delete();
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw new AppError('Failed to delete user', 500);
    }
  }
} 