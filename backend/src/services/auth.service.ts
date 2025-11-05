import { auth, db } from '../config/firebase';
import { AppError } from '../utils/error';
import { logger } from '../utils/logger';

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'admin';
  phone?: string;
  dateOfBirth?: Date;
  address?: string;
}

export interface UserResponse {
  uid: string;
  email: string;
  name: string;
  role: string;
  phone?: string | null;
  dateOfBirth?: Date | null;
  address?: string | null;
  createdAt?: Date;
  emailVerified?: boolean;
  isActive?: boolean;
  updatedAt?: Date;
}

export class AuthService {
  /**
   * Register a new user with Firebase Authentication and store details in Firestore
   */
  static async register(data: RegisterDTO): Promise<UserResponse> {
    try {
      const { email, password, name, role, phone, dateOfBirth, address } = data;

      // Check if user already exists in Firestore
      const existingUserQuery = await db
        .collection('users')
        .where('email', '==', email)
        .get();

      if (!existingUserQuery.empty) {
        throw new AppError('User with this email already exists', 400);
      }

      // Create user in Firebase Auth
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
        emailVerified: false,
      });

      // Set custom claims for role-based access control
      await auth.setCustomUserClaims(userRecord.uid, { role });

      // Create user document in Firestore
      const userData = {
        uid: userRecord.uid,
        email,
        name,
        role,
        phone: phone || null,
        dateOfBirth: dateOfBirth || null,
        address: address || null,
        emailVerified: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection('users').doc(userRecord.uid).set(userData);

      logger.info(`New user registered: ${email} with role: ${role}`);

      return userData;
    } catch (error: any) {
      logger.error('Error in register service:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'Failed to register user', 500);
    }
  }

  /**
   * Get user by UID from Firestore
   * Note: Authentication is handled by Firebase Auth on the client side
   */
  static async getUserById(uid: string): Promise<UserResponse | null> {
    try {
      const userDoc = await db.collection('users').doc(uid).get();

      if (!userDoc.exists) {
        return null;
      }

      const userData = userDoc.data();
      return userData as UserResponse;
    } catch (error) {
      logger.error('Error fetching user by ID:', error);
      throw new AppError('Failed to fetch user', 500);
    }
  }

  /**
   * Verify Firebase ID token and return user data
   */
  static async verifyIdToken(idToken: string): Promise<any> {
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      logger.error('Error verifying ID token:', error);
      throw new AppError('Invalid or expired token', 401);
    }
  }

  /**
   * Update user password in Firebase Auth
   */
  static async updatePassword(uid: string, newPassword: string): Promise<void> {
    try {
      const userDoc = await db.collection('users').doc(uid).get();

      if (!userDoc.exists) {
        throw new AppError('User not found', 404);
      }

      // Update password in Firebase Auth
      await auth.updateUser(uid, {
        password: newPassword,
      });

      // Update timestamp in Firestore
      await db.collection('users').doc(uid).update({
        updatedAt: new Date(),
      });

      logger.info(`Password updated for user: ${uid}`);
    } catch (error: any) {
      logger.error('Error updating password:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update password', 500);
    }
  }

  /**
   * Generate password reset link for user
   */
  static async resetPassword(email: string): Promise<string> {
    try {
      // Generate password reset link
      const resetLink = await auth.generatePasswordResetLink(email);

      logger.info(`Password reset link generated for ${email}`);

      // In production, send this link via email
      return resetLink;
    } catch (error: any) {
      logger.error('Error generating password reset link:', error);
      throw new AppError('Failed to generate password reset link', 500);
    }
  }

  /**
   * Verify user email
   */
  static async verifyEmail(uid: string): Promise<void> {
    try {
      await auth.updateUser(uid, {
        emailVerified: true,
      });

      await db.collection('users').doc(uid).update({
        emailVerified: true,
        updatedAt: new Date(),
      });

      logger.info(`Email verified for user: ${uid}`);
    } catch (error) {
      logger.error('Error verifying email:', error);
      throw new AppError('Failed to verify email', 500);
    }
  }

  /**
   * Delete user account (soft delete)
   */
  static async deleteUser(uid: string): Promise<void> {
    try {
      // Delete from Firebase Auth
      await auth.deleteUser(uid);

      // Soft delete in Firestore (mark as inactive)
      await db.collection('users').doc(uid).update({
        isActive: false,
        deletedAt: new Date(),
        updatedAt: new Date(),
      });

      logger.info(`User deleted: ${uid}`);
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw new AppError('Failed to delete user', 500);
    }
  }

  /**
   * Check if user is active
   */
  static async isUserActive(uid: string): Promise<boolean> {
    try {
      const userDoc = await db.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        return false;
      }

      const userData = userDoc.data();
      return userData?.isActive === true;
    } catch (error) {
      logger.error('Error checking user active status:', error);
      return false;
    }
  }
}
