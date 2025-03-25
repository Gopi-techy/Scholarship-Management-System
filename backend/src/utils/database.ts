import mongoose from 'mongoose';
import { logger } from './logger';
import { db } from '../config/firebase';

const connectDB = async (retryCount = 0, maxRetries = 3) => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      // For development, use a default local MongoDB URI if not provided
      logger.warn('MongoDB URI not found in environment variables, using default local connection');
      await mongoose.connect('mongodb://localhost:27017/scholarship_db');
    } else {
      await mongoose.connect(mongoURI);
    }

    logger.info('Successfully connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);

    if (retryCount < maxRetries) {
      const nextRetry = retryCount + 1;
      logger.info(`Retrying connection in 5 seconds... (Attempt ${nextRetry}/${maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(nextRetry, maxRetries);
    }

    logger.error('Failed to connect to MongoDB after maximum retries');
    process.exit(1);
  }
};

export default connectDB;

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});

// Handle application termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

export async function connectFirestore(): Promise<void> {
  try {
    // Test the Firestore connection
    await db.collection('test').doc('test').get();
    logger.info('Connected to Firestore successfully');
  } catch (error) {
    logger.error('Error connecting to Firestore:', error);
    throw error;
  }
}