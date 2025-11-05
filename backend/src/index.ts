import dotenv from 'dotenv';
import { logger } from './utils/logger';
import connectDB from './utils/database';
import app from './app';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Check required environment variables
const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL'
];

const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingVars.length > 0) {
  logger.warn('⚠️ Missing required environment variables:', missingVars);
  logger.warn('Some features may not work correctly.');
}

// Optional environment variables
const optionalVars = [
  'MONGODB_URI',
  'AZURE_STORAGE_CONNECTION_STRING',
  'AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT'
];

const missingOptional = optionalVars.filter(envVar => !process.env[envVar]);

if (missingOptional.length > 0) {
  logger.info('ℹ️ Missing optional environment variables:', missingOptional);
  logger.info('Some optional features will be disabled.');
}

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start Express server
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      
      // Log service status
      logger.info('\n🔧 Service Status:');
      logger.info('-------------------');
      logger.info(`MongoDB: ${process.env.MONGODB_URI ? '✅ Configured' : '⚠️ Using default'}`);
      logger.info(`Firebase: ${process.env.FIREBASE_PROJECT_ID ? '✅ Configured' : '❌ Not configured'}`);
      logger.info(`Azure Storage: ${process.env.AZURE_STORAGE_CONNECTION_STRING ? '✅ Configured' : '⚠️ Optional - Not configured'}`);
      logger.info(`Azure AI: ${process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT ? '✅ Configured' : '⚠️ Optional - Not configured'}`);
      logger.info('-------------------\n');
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Start the server
startServer(); 