import { messaging } from 'firebase-admin';
import { AppError } from '../utils/error';
import { logger } from '../utils/logger';
import { db } from '../config/firebase';

interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export class NotificationService {
  static async sendToUser(userId: string, notification: NotificationData): Promise<void> {
    try {
      // Get user's FCM token
      const userDoc = await db.collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        throw new AppError('User not found', 404);
      }

      const userData = userDoc.data();
      if (!userData?.fcmToken) {
        throw new AppError('User has no FCM token', 400);
      }

      // Send notification
      await messaging().send({
        token: userData.fcmToken,
        notification: {
          title: notification.title,
          body: notification.body
        },
        data: notification.data
      });

      logger.info(`Notification sent to user ${userId}`);
    } catch (error) {
      logger.error('Error sending notification to user:', error);
      throw new AppError('Failed to send notification', 500);
    }
  }

  static async sendToMultipleUsers(userIds: string[], notification: NotificationData): Promise<void> {
    try {
      // Get FCM tokens for all users
      const userDocs = await Promise.all(
        userIds.map(id => db.collection('users').doc(id).get())
      );

      const tokens = userDocs
        .filter(doc => doc.exists && doc.data()?.fcmToken)
        .map(doc => doc.data()?.fcmToken as string);

      if (tokens.length === 0) {
        throw new AppError('No valid FCM tokens found', 400);
      }

      // Send notification to all tokens
      await messaging().sendEachForMulticast({
        tokens,
        notification: {
          title: notification.title,
          body: notification.body
        },
        data: notification.data
      });

      logger.info(`Notification sent to ${tokens.length} users`);
    } catch (error) {
      logger.error('Error sending notification to multiple users:', error);
      throw new AppError('Failed to send notification', 500);
    }
  }

  static async sendToTopic(topic: string, notification: NotificationData): Promise<void> {
    try {
      await messaging().send({
        topic,
        notification: {
          title: notification.title,
          body: notification.body
        },
        data: notification.data
      });

      logger.info(`Notification sent to topic ${topic}`);
    } catch (error) {
      logger.error('Error sending notification to topic:', error);
      throw new AppError('Failed to send notification', 500);
    }
  }

  static async subscribeToTopic(userId: string, topic: string): Promise<void> {
    try {
      // Get user's FCM token
      const userDoc = await db.collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        throw new AppError('User not found', 404);
      }

      const userData = userDoc.data();
      if (!userData?.fcmToken) {
        throw new AppError('User has no FCM token', 400);
      }

      // Subscribe to topic
      await messaging().subscribeToTopic(userData.fcmToken, topic);

      logger.info(`User ${userId} subscribed to topic ${topic}`);
    } catch (error) {
      logger.error('Error subscribing to topic:', error);
      throw new AppError('Failed to subscribe to topic', 500);
    }
  }

  static async unsubscribeFromTopic(userId: string, topic: string): Promise<void> {
    try {
      // Get user's FCM token
      const userDoc = await db.collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        throw new AppError('User not found', 404);
      }

      const userData = userDoc.data();
      if (!userData?.fcmToken) {
        throw new AppError('User has no FCM token', 400);
      }

      // Unsubscribe from topic
      await messaging().unsubscribeFromTopic(userData.fcmToken, topic);

      logger.info(`User ${userId} unsubscribed from topic ${topic}`);
    } catch (error) {
      logger.error('Error unsubscribing from topic:', error);
      throw new AppError('Failed to unsubscribe from topic', 500);
    }
  }
} 