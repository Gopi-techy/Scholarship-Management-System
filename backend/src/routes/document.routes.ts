import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { Types } from 'mongoose';
import { Application, IDocument } from '../models/application.model';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';
import { authenticate, authorize } from '../middleware/auth';
import { uploadToAzure, deleteFromAzure } from '../utils/azure';
import { analyzeDocument } from '../utils/azureAI';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all documents for an application
router.get(
  '/:applicationId',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const application = await Application.findById(req.params.applicationId);
      if (!application) {
        throw new AppError('Application not found', 404);
      }

      // Check if user is authorized to view documents
      if (
        req.user.role !== 'admin' &&
        application.student.toString() !== req.user.userId
      ) {
        throw new AppError('Not authorized to view these documents', 403);
      }

      res.json({
        status: 'success',
        data: {
          documents: application.documents || [],
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Upload document
router.post(
  '/upload',
  authenticate,
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      if (!req.file) {
        throw new AppError('No file uploaded', 400);
      }

      const { applicationId, documentType } = req.body;
      if (!applicationId || !documentType) {
        throw new AppError('Application ID and document type are required', 400);
      }

      const application = await Application.findById(applicationId);
      if (!application) {
        throw new AppError('Application not found', 404);
      }

      // Check if user owns the application
      if (application.student.toString() !== req.user.userId) {
        throw new AppError('Not authorized to upload documents for this application', 403);
      }

      // Upload file to Azure Blob Storage
      const blobName = `${applicationId}/${documentType}-${Date.now()}`;
      const url = await uploadToAzure(req.file.buffer, blobName, req.file.mimetype);

      // Add document to application
      const newDocument: IDocument = {
        _id: new Types.ObjectId(),
        type: documentType,
        name: req.file.originalname,
        url,
        uploadedAt: new Date(),
        verified: false,
        verificationStatus: 'pending',
      };

      if (!application.documents) {
        application.documents = [];
      }
      application.documents.push(newDocument);
      await application.save();

      logger.info(`Document uploaded for application ${applicationId}`);

      res.json({
        status: 'success',
        data: {
          document: newDocument,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Delete document
router.delete(
  '/:applicationId/:documentId',
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

      // Check if user is authorized to delete documents
      if (
        req.user.role !== 'admin' &&
        application.student.toString() !== req.user.userId
      ) {
        throw new AppError('Not authorized to delete these documents', 403);
      }

      const document = application.documents?.find(
        (doc) => doc._id.toString() === documentId
      );
      if (!document) {
        throw new AppError('Document not found', 404);
      }

      // Delete from Azure Blob Storage
      try {
        await deleteFromAzure(document.url);
      } catch (error) {
        logger.error(`Failed to delete document from Azure: ${error}`);
      }

      // Remove document from application
      application.documents = application.documents.filter(
        (doc) => doc._id.toString() !== documentId
      );
      await application.save();

      logger.info(`Document ${documentId} deleted from application ${applicationId}`);

      res.json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Update document metadata
router.patch(
  '/:applicationId/:documentId',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const { applicationId, documentId } = req.params;
      const { type, name } = req.body;

      const application = await Application.findById(applicationId);
      if (!application) {
        throw new AppError('Application not found', 404);
      }

      // Check if user is authorized to update documents
      if (
        req.user.role !== 'admin' &&
        application.student.toString() !== req.user.userId
      ) {
        throw new AppError('Not authorized to update these documents', 403);
      }

      const document = application.documents?.find(
        (doc) => doc._id.toString() === documentId
      );
      if (!document) {
        throw new AppError('Document not found', 404);
      }

      if (type) document.type = type;
      if (name) document.name = name;

      await application.save();

      logger.info(`Document ${documentId} metadata updated for application ${applicationId}`);

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

// Test Azure AI connection
router.get(
  '/test-azure-ai',
  authenticate,
  authorize('admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Test with a sample document URL
      const testUrl = 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-sample-data-files/master/FormRecognizer/sample-invoice.pdf';
      const analysisResult = await analyzeDocument(testUrl);

      res.json({
        status: 'success',
        message: 'Azure AI Document Intelligence is working correctly',
        data: {
          analysis: analysisResult,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Upload and analyze document
router.post(
  '/analyze',
  authenticate,
  upload.single('document'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError('No document file provided', 400);
      }

      // Upload file to Azure Storage
      const fileUrl = await uploadToAzure(
        req.file.buffer,
        `${Date.now()}-${req.file.originalname}`,
        req.file.mimetype
      );

      // Analyze document using Azure AI
      const analysisResult = await analyzeDocument(fileUrl);

      res.json({
        status: 'success',
        data: {
          fileUrl,
          analysis: analysisResult,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// Analyze document from URL
router.post(
  '/analyze-url',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { documentUrl } = req.body;

      if (!documentUrl) {
        throw new AppError('Document URL is required', 400);
      }

      // Analyze document using Azure AI
      const analysisResult = await analyzeDocument(documentUrl);

      res.json({
        status: 'success',
        data: {
          analysis: analysisResult,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router; 