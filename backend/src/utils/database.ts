import mongoose from 'mongoose';
import { logger } from './logger';

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

export const connectDB = async (retryCount = 0): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pmsss';
    
    logger.info(`Attempting to connect to MongoDB (attempt ${retryCount + 1}/${MAX_RETRIES})`);
    const conn = await mongoose.connect(mongoURI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    
    if (retryCount < MAX_RETRIES - 1) {
      logger.info(`Retrying connection in ${RETRY_DELAY/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectDB(retryCount + 1);
    } else {
      logger.warn('Max retries reached. Starting server without MongoDB connection.');
      // Don't throw the error, just log it
      // This allows the application to start even if MongoDB is not available
      // The application will handle database errors appropriately in the routes
    }
  }
};

// Handle MongoDB connection errors
mongoose.connection.on('error', (error) => {
  logger.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected. The application will continue to run but database operations will fail.');
});

mongoose.connection.on('connected', () => {
  logger.info('MongoDB connection established');
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