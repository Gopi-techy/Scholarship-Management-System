import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import { DocumentService } from '../services/document.service';
import { AppError } from '../utils/error';

export const uploadDocument = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const document = await DocumentService.analyzeDocument(
      req.file.buffer,
      req.body.type,
      req.body.description,
      req.user.uid
    );

    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
};

export const getDocuments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const documents = await DocumentService.getUserDocuments(req.user.uid);
    res.json(documents);
  } catch (error) {
    next(error);
  }
};

export const getDocument = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const document = await DocumentService.getDocumentById(id);
    
    if (!document) {
      throw new AppError('Document not found', 404);
    }

    res.json(document);
  } catch (error) {
    next(error);
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await DocumentService.deleteDocument(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const verifyDocument = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const document = await DocumentService.verifyDocument(id, status);
    res.json(document);
  } catch (error) {
    next(error);
  }
};

export const getDocumentUrl = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const { blobName } = req.params;
    const url = await DocumentService.getDocumentUrl(blobName);
    res.json({ url });
  } catch (error) {
    next(error);
  }
}; 