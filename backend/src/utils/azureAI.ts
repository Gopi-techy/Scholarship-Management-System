import { DocumentAnalysisClient, AzureKeyCredential } from '@azure/ai-form-recognizer';
import { AppError } from './appError';
import { logger } from './logger';

const endpoint = process.env.AZURE_AI_ENDPOINT;
const apiKey = process.env.AZURE_AI_KEY;

let documentAnalysisClient: DocumentAnalysisClient | null = null;

export const initializeAzureAI = () => {
  try {
    logger.info('Initializing Azure AI Document Intelligence...');
    logger.info(`Endpoint exists: ${!!endpoint}`);
    logger.info(`API Key exists: ${!!apiKey}`);
    
    if (endpoint && apiKey) {
      documentAnalysisClient = new DocumentAnalysisClient(
        endpoint,
        new AzureKeyCredential(apiKey)
      );
      logger.info('Azure AI Document Intelligence initialized successfully');
    } else {
      logger.warn('Azure AI Document Intelligence is not configured');
    }
  } catch (error) {
    logger.error('Failed to initialize Azure AI Document Intelligence:', error);
  }
};

export const analyzeDocument = async (
  documentUrl: string
): Promise<{
  confidence: number;
  fields: Record<string, any>;
}> => {
  if (!documentAnalysisClient) {
    throw new AppError('Azure AI Document Intelligence is not configured', 500);
  }

  try {
    logger.info(`Starting document analysis for: ${documentUrl}`);
    const poller = await documentAnalysisClient.beginAnalyzeDocumentFromUrl(
      'prebuilt-document',
      documentUrl
    );
    const result = await poller.pollUntilDone();

    if (!result.documents || result.documents.length === 0) {
      throw new AppError('No documents found in the analysis result', 400);
    }

    const document = result.documents[0];
    logger.info('Document analyzed successfully');

    return {
      confidence: document.confidence,
      fields: document.fields,
    };
  } catch (error) {
    logger.error('Error analyzing document:', error);
    throw new AppError('Failed to analyze document', 500);
  }
}; 