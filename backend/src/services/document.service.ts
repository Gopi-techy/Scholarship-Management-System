import { documentsContainer, documentAnalysisClient, generateSasUrl } from '../config/azure.config';
import { AppError } from '../utils/error';
import { logger } from '../utils/logger';
import { db } from '../config/firebase';
import { FieldValue } from 'firebase-admin/firestore';

interface DocumentAnalysisResult {
  content: string;
  tables: any[];
  keyValuePairs: Record<string, string>;
}

interface DocumentMetadata {
  id: string;
  userId: string;
  type: string;
  description: string;
  blobUrl: string;
  analysisResult?: DocumentAnalysisResult;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export class DocumentService {
  /**
   * Upload document to Azure Blob Storage and create metadata in Firestore
   */
  static async uploadDocument(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    userId: string,
    documentType: string,
    description: string
  ): Promise<DocumentMetadata> {
    try {
      const timestamp = Date.now();
      const blobName = `${userId}/${documentType}/${timestamp}-${fileName}`;
      const blockBlobClient = documentsContainer.getBlockBlobClient(blobName);

      await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
        blobHTTPHeaders: {
          blobContentType: mimeType
        }
      });

      // Create document metadata in Firestore
      const docRef = await db.collection('documents').add({
        userId,
        type: documentType,
        description,
        blobUrl: blobName,
        fileName,
        mimeType,
        fileSize: fileBuffer.length,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Update user's documents array
      await db.collection('users').doc(userId).update({
        documents: FieldValue.arrayUnion(docRef.id)
      });

      logger.info(`Document uploaded for user ${userId}: ${fileName}`);

      return {
        id: docRef.id,
        userId,
        type: documentType,
        description,
        blobUrl: blobName,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error uploading document:', error);
      throw new AppError('Failed to upload document', 500);
    }
  }

  static async analyzeDocument(
    fileBuffer: Buffer,
    type: string,
    description: string,
    userId: string
  ): Promise<DocumentMetadata> {
    try {
      if (!documentAnalysisClient) {
        throw new AppError('Document analysis client not initialized', 500);
      }

      // Upload document to blob storage
      const blobName = `${userId}/${Date.now()}-${type}.pdf`;
      const blockBlobClient = documentsContainer.getBlockBlobClient(blobName);
      await blockBlobClient.upload(fileBuffer, fileBuffer.length);

      // Analyze document using Azure Form Recognizer
      const poller = await documentAnalysisClient.beginAnalyzeDocument(
        'prebuilt-document',
        fileBuffer
      );

      const result = await poller.pollUntilDone();

      // Extract relevant information from analysis result
      const analysisResult: DocumentAnalysisResult = {
        content: result.content || '',
        tables: result.tables || [],
        keyValuePairs: result.keyValuePairs?.reduce((acc, kvp) => {
          if (kvp.key && kvp.value) {
            acc[kvp.key.content] = kvp.value.content;
          }
          return acc;
        }, {} as Record<string, string>) || {}
      };

      // Save document metadata to Firestore
      const docRef = await db.collection('documents').add({
        userId,
        type,
        description,
        blobUrl: blobName,
        analysisResult,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Update user's documents array
      await db.collection('users').doc(userId).update({
        documents: FieldValue.arrayUnion(docRef.id)
      });

      return {
        id: docRef.id,
        userId,
        type,
        description,
        blobUrl: blobName,
        analysisResult,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Error analyzing document:', error);
      throw new AppError('Failed to analyze document', 500);
    }
  }

  static async getUserDocuments(userId: string): Promise<DocumentMetadata[]> {
    try {
      const snapshot = await db.collection('documents')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as DocumentMetadata));
    } catch (error) {
      logger.error('Error getting user documents:', error);
      throw new AppError('Failed to get user documents', 500);
    }
  }

  static async getDocumentById(id: string): Promise<DocumentMetadata | null> {
    try {
      const doc = await db.collection('documents').doc(id).get();
      
      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data()
      } as DocumentMetadata;
    } catch (error) {
      logger.error('Error getting document:', error);
      throw new AppError('Failed to get document', 500);
    }
  }

  static async deleteDocument(id: string): Promise<void> {
    try {
      const doc = await db.collection('documents').doc(id).get();
      
      if (!doc.exists) {
        throw new AppError('Document not found', 404);
      }

      const data = doc.data() as DocumentMetadata;
      
      // Delete from blob storage
      const blockBlobClient = documentsContainer.getBlockBlobClient(data.blobUrl);
      await blockBlobClient.delete();

      // Delete from Firestore
      await doc.ref.delete();

      // Remove document from user's documents array
      await db.collection('users').doc(data.userId).update({
        documents: FieldValue.arrayRemove(id)
      });
    } catch (error) {
      logger.error('Error deleting document:', error);
      throw new AppError('Failed to delete document', 500);
    }
  }

  static async verifyDocument(id: string, status: 'verified' | 'rejected'): Promise<DocumentMetadata> {
    try {
      const doc = await db.collection('documents').doc(id).get();
      
      if (!doc.exists) {
        throw new AppError('Document not found', 404);
      }

      await doc.ref.update({
        status,
        updatedAt: new Date()
      });

      return {
        id: doc.id,
        ...doc.data(),
        status,
        updatedAt: new Date()
      } as DocumentMetadata;
    } catch (error) {
      logger.error('Error verifying document:', error);
      throw new AppError('Failed to verify document', 500);
    }
  }

  static async getDocumentUrl(blobName: string): Promise<string> {
    try {
      return await generateSasUrl(blobName);
    } catch (error) {
      logger.error('Error generating document URL:', error);
      throw new AppError('Failed to generate document URL', 500);
    }
  }
} 