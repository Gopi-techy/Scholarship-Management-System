import { BlobServiceClient, ContainerClient, StorageSharedKeyCredential, BlobSASPermissions } from '@azure/storage-blob';
import { AzureKeyCredential, DocumentAnalysisClient } from '@azure/ai-form-recognizer';
import { logger } from '../utils/logger';

// Azure Storage configuration
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'documents';

let blobServiceClient: BlobServiceClient;
let documentsContainer: ContainerClient;

if (accountName && accountKey) {
  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
  blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
  );
  documentsContainer = blobServiceClient.getContainerClient(containerName);
  logger.info('Azure Storage initialized successfully');
} else {
  logger.warn('Azure Storage credentials not provided');
}

// Azure Form Recognizer configuration
const endpoint = process.env.AZURE_FORM_RECOGNIZER_ENDPOINT;
const key = process.env.AZURE_FORM_RECOGNIZER_KEY;

let documentAnalysisClient: DocumentAnalysisClient | null = null;

if (endpoint && key) {
  documentAnalysisClient = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));
  logger.info('Azure Form Recognizer initialized successfully');
} else {
  logger.warn('Azure Form Recognizer credentials not provided');
}

// Generate SAS URL for blob
const generateSasUrl = async (blobName: string): Promise<string> => {
  if (!blobServiceClient) {
    throw new Error('Azure Storage not initialized');
  }

  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  // Generate SAS token that expires in 1 hour
  const sasToken = await blobClient.generateSasUrl({
    permissions: BlobSASPermissions.parse('r'),
    expiresOn: new Date(new Date().valueOf() + 3600 * 1000)
  });

  return sasToken;
};

export {
  documentsContainer,
  documentAnalysisClient,
  generateSasUrl
}; 