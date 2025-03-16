import { BlobServiceClient } from '@azure/storage-blob';
import { AppError } from './appError';
import { logger } from './logger';

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'documents';

let blobServiceClient: BlobServiceClient | null = null;
let containerClient: any = null;

export const initializeAzureStorage = () => {
  try {
    logger.info('Initializing Azure Storage...');
    logger.info(`Connection string exists: ${!!connectionString}`);
    logger.info(`Container name: ${containerName}`);
    
    if (connectionString && connectionString.trim() !== '') {
      blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
      containerClient = blobServiceClient.getContainerClient(containerName);
      logger.info('Azure Blob Storage initialized successfully');
    } else {
      logger.warn('Azure Storage connection string is not configured');
    }
  } catch (error) {
    logger.error('Failed to initialize Azure Blob Storage:', error);
  }
};

export const uploadToAzure = async (
  buffer: Buffer,
  blobName: string,
  contentType: string
): Promise<string> => {
  if (!containerClient) {
    throw new AppError('Azure Blob Storage is not configured', 500);
  }

  try {
    // Create container if it doesn't exist
    await containerClient.createIfNotExists();

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload data
    await blockBlobClient.upload(buffer, buffer.length, {
      blobHTTPHeaders: { blobContentType: contentType },
    });

    logger.info(`File uploaded successfully to Azure: ${blobName}`);
    return blockBlobClient.url;
  } catch (error) {
    logger.error(`Error uploading file to Azure: ${error}`);
    throw new AppError('Failed to upload file to Azure', 500);
  }
};

export const deleteFromAzure = async (url: string): Promise<void> => {
  if (!containerClient) {
    throw new AppError('Azure Blob Storage is not configured', 500);
  }

  try {
    // Extract blob name from URL
    const blobName = url.split('/').pop();
    if (!blobName) {
      throw new AppError('Invalid blob URL', 400);
    }

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Delete the blob
    await blockBlobClient.delete();
    logger.info(`File deleted successfully from Azure: ${blobName}`);
  } catch (error) {
    logger.error(`Error deleting file from Azure: ${error}`);
    throw new AppError('Failed to delete file from Azure', 500);
  }
}; 