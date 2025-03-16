import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { Application, IApplication } from '../models/application.model';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';

const router = Router();

// Get all applications
router.get(
  '/applications',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const applications = await Application.find()
        .select('-__v')
        .populate('student', 'name email')
        .lean();

      res.json({
        status: 'success',
        data: {
          applications,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get application by ID
router.get(
  '/applications/:id',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const application = await Application.findById(req.params.id)
        .select('-__v')
        .populate('student', 'name email')
        .lean();

      if (!application) {
        throw new AppError('Application not found', 404);
      }

      res.json({
        status: 'success',
        data: {
          application,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get application statistics
router.get(
  '/statistics',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const stats = await Application.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      const statistics = stats.reduce(
        (acc: { [key: string]: number }, curr: { _id: string; count: number }) => {
          acc[curr._id] = curr.count;
          return acc;
        },
        {
          draft: 0,
          submitted: 0,
          under_review: 0,
          approved: 0,
          rejected: 0,
        }
      );

      res.json({
        status: 'success',
        data: {
          statistics,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get recent applications
router.get(
  '/recent-applications',
  authenticate,
  authorize('admin'),
  async (req, res, next) => {
    try {
      const applications = await Application.find()
        .populate('student', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .limit(5);

      res.status(200).json({
        status: 'success',
        data: {
          applications,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Verify document
router.patch(
  '/applications/:applicationId/documents/:documentId/verify',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { applicationId, documentId } = req.params;

      const application = await Application.findById(applicationId);
      if (!application) {
        throw new AppError('Application not found', 404);
      }

      const document = application.documents.find(
        (doc) => doc._id.toString() === documentId
      );
      if (!document) {
        throw new AppError('Document not found', 404);
      }

      document.verified = true;
      document.verificationStatus = 'approved';
      await application.save();

      // Check if all documents are verified
      const allDocumentsVerified = application.documents.every(
        (doc) => doc.verificationStatus === 'approved'
      );

      if (allDocumentsVerified) {
        application.status = 'under_review';
        await application.save();
      }

      logger.info(
        `Document ${documentId} verified for application ${applicationId} by admin: ${req.user.userId}`
      );

      res.json({
        status: 'success',
        data: {
          document,
          applicationStatus: application.status,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Reject document
router.patch(
  '/applications/:applicationId/documents/:documentId/reject',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { applicationId, documentId } = req.params;
      const { reason } = req.body;

      if (!reason) {
        throw new AppError('Rejection reason is required', 400);
      }

      const application = await Application.findById(applicationId);
      if (!application) {
        throw new AppError('Application not found', 404);
      }

      const document = application.documents.find(
        (doc) => doc._id.toString() === documentId
      );
      if (!document) {
        throw new AppError('Document not found', 404);
      }

      document.verified = false;
      document.verificationStatus = 'rejected';
      document.rejectionReason = reason;
      await application.save();

      logger.info(
        `Document ${documentId} rejected for application ${applicationId} by admin: ${req.user.userId}`
      );

      res.json({
        status: 'success',
        data: {
          document,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update application status
router.patch(
  '/applications/:id/status',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { status, remarks } = req.body;
      const validStatuses = ['under_review', 'approved', 'rejected'];

      if (!validStatuses.includes(status)) {
        throw new AppError('Invalid status', 400);
      }

      const application = await Application.findById(req.params.id);
      if (!application) {
        throw new AppError('Application not found', 404);
      }

      application.status = status;
      application.reviewedAt = new Date();
      application.reviewedBy = new Types.ObjectId(req.user.userId);

      if (status === 'rejected' && remarks) {
        application.rejectionReason = remarks;
      }

      await application.save();

      logger.info(
        `Application ${application._id} status updated to ${status} by admin: ${req.user.userId}`
      );

      res.json({
        status: 'success',
        data: {
          application: {
            id: application._id,
            status: application.status,
            reviewedAt: application.reviewedAt,
            reviewedBy: application.reviewedBy,
            rejectionReason: application.rejectionReason,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router; 