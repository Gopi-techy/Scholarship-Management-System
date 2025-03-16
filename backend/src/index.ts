import { config } from 'dotenv';
import path from 'path';

// Load environment variables first
config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './utils/database';
import { initializeFirebase } from './utils/firebase';
import { initializeAzureStorage } from './utils/azure';
import { initializeAzureAI } from './utils/azureAI';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import studentRoutes from './routes/student.routes';
import adminRoutes from './routes/admin.routes';
import documentRoutes from './routes/document.routes';
import authRoutes from './routes/auth.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize services
logger.info('Starting service initialization...');
initializeFirebase();
logger.info('Firebase initialized, initializing Azure Storage...');
initializeAzureStorage();
logger.info('Azure Storage initialized, initializing Azure AI...');
initializeAzureAI();
logger.info('Azure AI initialized, connecting to MongoDB...');
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/documents', documentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
}); 