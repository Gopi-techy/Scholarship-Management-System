import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middleware/error';

// Import routes
import authRoutes from './routes/auth.routes';
import scholarshipRoutes from './routes/scholarship.routes';
import applicationRoutes from './routes/application.routes';
import userRoutes from './routes/user.routes';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend development server
  credentials: true
}));
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (without authentication for now)
app.use('/api/auth', authRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling
app.use(errorHandler);

export default app; 