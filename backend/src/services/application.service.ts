import { db } from '../config/firebase';
import { AppError } from '../utils/error';
import { logger } from '../utils/logger';
import { FieldValue } from 'firebase-admin/firestore';

interface ApplicationData {
  id: string;
  studentId: string;
  scholarshipId: string;
  documents: Array<{
    type: string;
    blobUrl: string;
  }>;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  comments?: string;
  notes: Array<{
    content: string;
    createdAt: Date;
    createdBy: string;
  }>;
}

export class ApplicationService {
  static async createApplication(
    studentId: string,
    scholarshipId: string,
    documents: Array<{ type: string; blobUrl: string }>
  ): Promise<ApplicationData> {
    try {
      const docRef = await db.collection('applications').add({
        studentId,
        scholarshipId,
        documents,
        status: 'pending',
        submittedAt: new Date(),
        notes: []
      });

      return {
        id: docRef.id,
        studentId,
        scholarshipId,
        documents,
        status: 'pending',
        submittedAt: new Date(),
        notes: []
      };
    } catch (error) {
      logger.error('Error creating application:', error);
      throw new AppError('Failed to create application', 500);
    }
  }

  static async getApplications(): Promise<ApplicationData[]> {
    try {
      const snapshot = await db.collection('applications')
        .orderBy('submittedAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ApplicationData));
    } catch (error) {
      logger.error('Error getting applications:', error);
      throw new AppError('Failed to get applications', 500);
    }
  }

  static async getApplication(id: string): Promise<ApplicationData | null> {
    try {
      const doc = await db.collection('applications').doc(id).get();
      
      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data()
      } as ApplicationData;
    } catch (error) {
      logger.error('Error getting application:', error);
      throw new AppError('Failed to get application', 500);
    }
  }

  static async updateApplicationStatus(
    id: string,
    status: 'approved' | 'rejected',
    reviewedBy: string,
    comments?: string
  ): Promise<ApplicationData> {
    try {
      const doc = await db.collection('applications').doc(id).get();
      
      if (!doc.exists) {
        throw new AppError('Application not found', 404);
      }

      await doc.ref.update({
        status,
        reviewedAt: new Date(),
        reviewedBy,
        comments
      });

      return {
        id: doc.id,
        ...doc.data(),
        status,
        reviewedAt: new Date(),
        reviewedBy,
        comments
      } as ApplicationData;
    } catch (error) {
      logger.error('Error updating application status:', error);
      throw new AppError('Failed to update application status', 500);
    }
  }

  static async addReviewNote(
    id: string,
    content: string,
    createdBy: string
  ): Promise<ApplicationData> {
    try {
      const doc = await db.collection('applications').doc(id).get();
      
      if (!doc.exists) {
        throw new AppError('Application not found', 404);
      }

      const note = {
        content,
        createdAt: new Date(),
        createdBy
      };

      await doc.ref.update({
        notes: FieldValue.arrayUnion(note)
      });

      return {
        id: doc.id,
        ...doc.data(),
        notes: [...(doc.data()?.notes || []), note]
      } as ApplicationData;
    } catch (error) {
      logger.error('Error adding review note:', error);
      throw new AppError('Failed to add review note', 500);
    }
  }
} 