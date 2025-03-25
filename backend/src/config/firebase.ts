import admin from 'firebase-admin';
import { logger } from '../utils/logger';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
    logger.info('Firebase Admin initialized successfully');
  } catch (error) {
    logger.error('Error initializing Firebase Admin:', error);
    throw error;
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
export const storage = admin.storage();
export const messaging = admin.messaging();
export const FieldValue = admin.firestore.FieldValue; 