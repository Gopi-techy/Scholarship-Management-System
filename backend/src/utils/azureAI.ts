import { logger } from './logger';

// Azure AI is temporarily disabled
export interface DocumentAnalysis {
  text: string;
  confidence: number;
  pages: number;
}

export const isAzureAIEnabled = false;

// Helper function to check if Azure AI is available
export const checkAzureAIAvailability = () => {
  logger.warn('Azure Form Recognizer is currently disabled.');
  return false;
};

export async function analyzeDocument(_documentUrl: string): Promise<DocumentAnalysis> {
  logger.warn('Document analysis is currently disabled.');
  return {
    text: 'Document analysis is currently disabled.',
    confidence: 0,
    pages: 0
  };
} 