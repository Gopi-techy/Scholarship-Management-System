import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { Application, IApplication } from '../models/application.model';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get application status
router.get(
  '/application/status',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const application = await Application.findOne({ student: req.user.userId });
      if (!application) {
        return res.json({
          status: 'success',
          data: {
            application: null,
          },
        });
      }

      res.json({
        status: 'success',
        data: {
          application: {
            id: application._id,
            status: application.status,
            submittedAt: application.submittedAt,
            lastUpdated: application.updatedAt,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Create or update application
router.post(
  '/application',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const {
        personalInfo,
        academicInfo,
        familyInfo,
        documents,
      } = req.body;

      let application = await Application.findOne({ student: req.user.userId });

      if (!application) {
        application = new Application({
          student: req.user.userId,
          personalInfo,
          academicInfo,
          familyInfo,
          documents: documents || [],
          status: 'draft',
        });
      } else {
        application.personalInfo = personalInfo;
        application.academicInfo = academicInfo;
        application.familyInfo = familyInfo;
        if (documents) {
          application.documents = documents;
        }
      }

      await application.save();

      logger.info(
        `Application ${application.status === 'draft' ? 'created' : 'updated'} for student: ${req.user.userId}`
      );

      res.json({
        status: 'success',
        data: {
          application: {
            id: application._id,
            status: application.status,
            submittedAt: application.submittedAt,
            lastUpdated: application.updatedAt,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Submit application
router.post(
  '/application/submit',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const application = await Application.findOne({ student: req.user.userId });
      if (!application) {
        throw new AppError('No application found', 404);
      }

      if (application.status !== 'draft') {
        throw new AppError('Application already submitted', 400);
      }

      if (!application.documents || application.documents.length === 0) {
        throw new AppError('Please upload all required documents', 400);
      }

      application.status = 'submitted';
      application.submittedAt = new Date();
      await application.save();

      logger.info(`Application submitted by student: ${req.user.userId}`);

      res.json({
        status: 'success',
        data: {
          application: {
            id: application._id,
            status: application.status,
            submittedAt: application.submittedAt,
            lastUpdated: application.updatedAt,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get application details
router.get(
  '/application',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const application = await Application.findOne({ student: req.user.userId })
        .select('-__v')
        .lean();

      if (!application) {
        return res.json({
          status: 'success',
          data: {
            application: null,
          },
        });
      }

      res.json({
        status: 'success',
        data: {
          application: {
            ...application,
            documents: application.documents || [],
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router; 