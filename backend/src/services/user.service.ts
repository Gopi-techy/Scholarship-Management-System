import { db } from '../config/firebase';
import { AppError } from '../utils/error';
import { logger } from '../utils/logger';

export interface UpdateUserDTO {
  name?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
}

export interface UserData {
  uid: string;
  email: string;
  name: string;
  role: string;
  phone?: string | null;
  dateOfBirth?: Date | null;
  address?: string | null;
  isActive?: boolean;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserService {
  static async getAllUsers(role?: string): Promise<UserData[]> {
    try {
      let query = db.collection('users').where('isActive', '==', true);

      if (role) {
        query = query.where('role', '==', role);
      }

      const snapshot = await query.get();
      const users: UserData[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const { password, ...userData } = data;
        users.push(userData as UserData);
      });

      return users;
    } catch (error) {
      logger.error('Error fetching all users:', error);
      throw new AppError('Failed to fetch users', 500);
    }
  }

  static async getUserById(uid: string): Promise<UserData | null> {
    try {
      const userDoc = await db.collection('users').doc(uid).get();

      if (!userDoc.exists) {
        return null;
      }

      const data = userDoc.data();
      if (!data) {
        return null;
      }

      const { password, ...userData } = data;
      return userData as UserData;
    } catch (error) {
      logger.error('Error fetching user by ID:', error);
      throw new AppError('Failed to fetch user', 500);
    }
  }

  static async getUserByEmail(email: string): Promise<UserData | null> {
    try {
      const userQuery = await db
        .collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (userQuery.empty) {
        return null;
      }

      const data = userQuery.docs[0].data();
      const { password, ...userData } = data;
      return userData as UserData;
    } catch (error) {
      logger.error('Error fetching user by email:', error);
      throw new AppError('Failed to fetch user', 500);
    }
  }

  static async updateUser(uid: string, updates: UpdateUserDTO): Promise<UserData> {
    try {
      const userDoc = await db.collection('users').doc(uid).get();

      if (!userDoc.exists) {
        throw new AppError('User not found', 404);
      }

      const updateData = {
        ...updates,
        updatedAt: new Date(),
      };

      await db.collection('users').doc(uid).update(updateData);

      const updatedDoc = await db.collection('users').doc(uid).get();
      const data = updatedDoc.data();
      
      if (!data) {
        throw new AppError('User not found after update', 404);
      }

      const { password, ...userData } = data;
      logger.info(`User updated: ${uid}`);
      
      return userData as UserData;
    } catch (error: any) {
      logger.error('Error updating user:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update user', 500);
    }
  }

  static async deleteUser(uid: string): Promise<void> {
    try {
      const userDoc = await db.collection('users').doc(uid).get();

      if (!userDoc.exists) {
        throw new AppError('User not found', 404);
      }

      // Soft delete - mark as inactive
      await db.collection('users').doc(uid).update({
        isActive: false,
        deletedAt: new Date(),
        updatedAt: new Date(),
      });

      logger.info(`User soft deleted: ${uid}`);
    } catch (error: any) {
      logger.error('Error deleting user:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete user', 500);
    }
  }

  static async activateUser(uid: string): Promise<UserData> {
    try {
      const userDoc = await db.collection('users').doc(uid).get();

      if (!userDoc.exists) {
        throw new AppError('User not found', 404);
      }

      await db.collection('users').doc(uid).update({
        isActive: true,
        updatedAt: new Date(),
      });

      const updatedDoc = await db.collection('users').doc(uid).get();
      const data = updatedDoc.data();
      
      if (!data) {
        throw new AppError('User not found after activation', 404);
      }

      const { password, ...userData } = data;
      logger.info(`User activated: ${uid}`);
      
      return userData as UserData;
    } catch (error: any) {
      logger.error('Error activating user:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to activate user', 500);
    }
  }

  static async updateUserRole(uid: string, newRole: string): Promise<UserData> {
    try {
      const userDoc = await db.collection('users').doc(uid).get();

      if (!userDoc.exists) {
        throw new AppError('User not found', 404);
      }

      await db.collection('users').doc(uid).update({
        role: newRole,
        updatedAt: new Date(),
      });

      const updatedDoc = await db.collection('users').doc(uid).get();
      const data = updatedDoc.data();
      
      if (!data) {
        throw new AppError('User not found after role update', 404);
      }

      const { password, ...userData } = data;
      logger.info(`User role updated: ${uid} to ${newRole}`);
      
      return userData as UserData;
    } catch (error: any) {
      logger.error('Error updating user role:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update user role', 500);
    }
  }

  static async getUserStats(): Promise<any> {
    try {
      const usersSnapshot = await db.collection('users').where('isActive', '==', true).get();
      
      const stats = {
        total: usersSnapshot.size,
        students: 0,
        admins: 0,
        verified: 0,
        unverified: 0,
      };

      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.role === 'student') stats.students++;
        if (data.role === 'admin') stats.admins++;
        if (data.emailVerified) stats.verified++;
        else stats.unverified++;
      });

      return stats;
    } catch (error) {
      logger.error('Error fetching user stats:', error);
      throw new AppError('Failed to fetch user stats', 500);
    }
  }
}
