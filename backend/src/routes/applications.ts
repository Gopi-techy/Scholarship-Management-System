import { Router } from 'express';
import { ApplicationService } from '../services/application.service';
import { auth } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { applicationSchema } from '../schemas/application.schema';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../utils/error';

const router = Router();

// Create new application
router.post(
  '/',
  auth,
  validate(applicationSchema),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { scholarshipId, documents } = req.body;
      const application = await ApplicationService.createApplication(
        req.user.uid,
        scholarshipId,
        documents
      );
      res.status(201).json(application);
    } catch (error) {
      next(error);
    }
  }
);

// Get all applications (admin only)
router.get(
  '/',
  auth,
  authorizeRoles('admin'),
  async (_req: AuthRequest, res, next) => {
    try {
      const applications = await ApplicationService.getApplications();
      res.json(applications);
    } catch (error) {
      next(error);
    }
  }
);

// Get application by ID
router.get(
  '/:id',
  auth,
  async (req: AuthRequest, res, next) => {
    try {
      const application = await ApplicationService.getApplication(req.params.id);
      if (!application) {
        throw new AppError('Application not found', 404);
      }
      res.json(application);
    } catch (error) {
      next(error);
    }
  }
);

// Update application status (admin only)
router.patch(
  '/:id/status',
  auth,
  authorizeRoles('admin'),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { status, comments } = req.body;
      const application = await ApplicationService.updateApplicationStatus(
        req.params.id,
        status,
        req.user.uid,
        comments
      );
      res.json(application);
    } catch (error) {
      next(error);
    }
  }
);

// Add review note (admin only)
router.post(
  '/:id/notes',
  auth,
  authorizeRoles('admin'),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      const { content } = req.body;
      const application = await ApplicationService.addReviewNote(
        req.params.id,
        content,
        req.user.uid
      );
      res.json(application);
    } catch (error) {
      next(error);
    }
  }
);

export default router; 