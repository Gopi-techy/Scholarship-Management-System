import { logger } from './logger';

// Azure Storage is temporarily disabled
export const uploadDocument = async (_file: Express.Multer.File) => {
  logger.warn('Document upload is currently disabled');
  return {
    success: false,
    message: 'Document upload is currently disabled',
    url: ''
  };
};

export const deleteDocument = async (_blobName: string) => {
  logger.warn('Document deletion is currently disabled');
  return {
    success: false,
    message: 'Document deletion is currently disabled'
  };
}; 