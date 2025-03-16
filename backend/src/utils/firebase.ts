import * as admin from 'firebase-admin';
import { logger } from './logger';

let firebaseAdmin: admin.app.App | null = null;

export const initializeFirebase = () => {
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (!serviceAccount) {
      logger.warn('Firebase service account is not configured');
      return;
    }

    try {
      const serviceAccountJson = JSON.parse(serviceAccount);
      
      if (!firebaseAdmin) {
        firebaseAdmin = admin.initializeApp({
          credential: admin.credential.cert(serviceAccountJson),
        });
      }

      logger.info('Firebase Admin initialized successfully');
    } catch (error) {
      logger.error('Error parsing Firebase service account JSON:', error);
    }
  } catch (error) {
    logger.error('Error initializing Firebase Admin:', error);
  }
};

export const getFirebaseAdmin = () => {
  if (!firebaseAdmin) {
    throw new Error('Firebase Admin is not initialized');
  }
  return firebaseAdmin;
};

export const auth = admin.auth; 