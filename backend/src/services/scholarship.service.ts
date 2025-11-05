import { db, FieldValue } from '../config/firebase';
import { AppError } from '../utils/error';
import { logger } from '../utils/logger';

export interface CreateScholarshipDTO {
  title: string;
  description: string;
  amount: number;
  eligibility: {
    minGPA?: number;
    maxAge?: number;
    minAge?: number;
    educationLevel?: string[];
    citizenshipRequired?: boolean;
    specificMajors?: string[];
  };
  deadline: Date;
  startDate: Date;
  endDate: Date;
  availableSlots: number;
  requirements: string[];
  benefits: string[];
  applicationProcess: string;
  contactEmail: string;
  organizationName: string;
  category?: string;
  tags?: string[];
}

export interface UpdateScholarshipDTO extends Partial<CreateScholarshipDTO> {
  isActive?: boolean;
}

export interface ScholarshipData extends CreateScholarshipDTO {
  id: string;
  createdBy: string;
  isActive: boolean;
  applicationCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ScholarshipService {
  static async createScholarship(
    data: CreateScholarshipDTO,
    createdBy: string
  ): Promise<ScholarshipData> {
    try {
      const scholarshipData = {
        ...data,
        createdBy,
        isActive: true,
        applicationCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await db.collection('scholarships').add(scholarshipData);
      const doc = await docRef.get();

      logger.info(`New scholarship created: ${data.title} by ${createdBy}`);

      return {
        id: doc.id,
        ...doc.data(),
      } as ScholarshipData;
    } catch (error) {
      logger.error('Error creating scholarship:', error);
      throw new AppError('Failed to create scholarship', 500);
    }
  }

  static async getAllScholarships(filters?: {
    isActive?: boolean;
    category?: string;
    minAmount?: number;
    maxAmount?: number;
  }): Promise<ScholarshipData[]> {
    try {
      let query: any = db.collection('scholarships');

      if (filters?.isActive !== undefined) {
        query = query.where('isActive', '==', filters.isActive);
      }

      if (filters?.category) {
        query = query.where('category', '==', filters.category);
      }

      const snapshot = await query.get();
      const scholarships: ScholarshipData[] = [];

      snapshot.forEach((doc: any) => {
        const data = doc.data();
        
        // Apply client-side filtering for amount range
        if (filters?.minAmount && data.amount < filters.minAmount) return;
        if (filters?.maxAmount && data.amount > filters.maxAmount) return;

        scholarships.push({
          id: doc.id,
          ...data,
        } as ScholarshipData);
      });

      return scholarships;
    } catch (error) {
      logger.error('Error fetching scholarships:', error);
      throw new AppError('Failed to fetch scholarships', 500);
    }
  }

  static async getScholarshipById(id: string): Promise<ScholarshipData | null> {
    try {
      const doc = await db.collection('scholarships').doc(id).get();

      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data(),
      } as ScholarshipData;
    } catch (error) {
      logger.error('Error fetching scholarship by ID:', error);
      throw new AppError('Failed to fetch scholarship', 500);
    }
  }

  static async updateScholarship(
    id: string,
    updates: UpdateScholarshipDTO
  ): Promise<ScholarshipData> {
    try {
      const scholarshipDoc = await db.collection('scholarships').doc(id).get();

      if (!scholarshipDoc.exists) {
        throw new AppError('Scholarship not found', 404);
      }

      const updateData = {
        ...updates,
        updatedAt: new Date(),
      };

      await db.collection('scholarships').doc(id).update(updateData);

      const updatedDoc = await db.collection('scholarships').doc(id).get();

      logger.info(`Scholarship updated: ${id}`);

      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      } as ScholarshipData;
    } catch (error: any) {
      logger.error('Error updating scholarship:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update scholarship', 500);
    }
  }

  static async deleteScholarship(id: string): Promise<void> {
    try {
      const scholarshipDoc = await db.collection('scholarships').doc(id).get();

      if (!scholarshipDoc.exists) {
        throw new AppError('Scholarship not found', 404);
      }

      // Soft delete - mark as inactive
      await db.collection('scholarships').doc(id).update({
        isActive: false,
        deletedAt: new Date(),
        updatedAt: new Date(),
      });

      logger.info(`Scholarship soft deleted: ${id}`);
    } catch (error: any) {
      logger.error('Error deleting scholarship:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete scholarship', 500);
    }
  }

  static async activateScholarship(id: string): Promise<ScholarshipData> {
    try {
      const scholarshipDoc = await db.collection('scholarships').doc(id).get();

      if (!scholarshipDoc.exists) {
        throw new AppError('Scholarship not found', 404);
      }

      await db.collection('scholarships').doc(id).update({
        isActive: true,
        updatedAt: new Date(),
      });

      const updatedDoc = await db.collection('scholarships').doc(id).get();

      logger.info(`Scholarship activated: ${id}`);

      return {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      } as ScholarshipData;
    } catch (error: any) {
      logger.error('Error activating scholarship:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to activate scholarship', 500);
    }
  }

  static async incrementApplicationCount(id: string): Promise<void> {
    try {
      await db.collection('scholarships').doc(id).update({
        applicationCount: FieldValue.increment(1),
        updatedAt: new Date(),
      });

      logger.info(`Application count incremented for scholarship: ${id}`);
    } catch (error) {
      logger.error('Error incrementing application count:', error);
      throw new AppError('Failed to update application count', 500);
    }
  }

  static async decrementApplicationCount(id: string): Promise<void> {
    try {
      await db.collection('scholarships').doc(id).update({
        applicationCount: FieldValue.increment(-1),
        updatedAt: new Date(),
      });

      logger.info(`Application count decremented for scholarship: ${id}`);
    } catch (error) {
      logger.error('Error decrementing application count:', error);
      throw new AppError('Failed to update application count', 500);
    }
  }

  static async getScholarshipsByDeadline(daysAhead: number = 30): Promise<ScholarshipData[]> {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);

      const snapshot = await db
        .collection('scholarships')
        .where('isActive', '==', true)
        .where('deadline', '<=', futureDate)
        .get();

      const scholarships: ScholarshipData[] = [];

      snapshot.forEach((doc) => {
        scholarships.push({
          id: doc.id,
          ...doc.data(),
        } as ScholarshipData);
      });

      return scholarships.filter(
        (s) => new Date(s.deadline) >= new Date()
      );
    } catch (error) {
      logger.error('Error fetching scholarships by deadline:', error);
      throw new AppError('Failed to fetch scholarships', 500);
    }
  }

  static async getScholarshipStats(): Promise<any> {
    try {
      const snapshot = await db.collection('scholarships').get();

      const stats = {
        total: snapshot.size,
        active: 0,
        inactive: 0,
        totalAmount: 0,
        totalApplications: 0,
      };

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.isActive) stats.active++;
        else stats.inactive++;
        stats.totalAmount += data.amount || 0;
        stats.totalApplications += data.applicationCount || 0;
      });

      return stats;
    } catch (error) {
      logger.error('Error fetching scholarship stats:', error);
      throw new AppError('Failed to fetch scholarship stats', 500);
    }
  }

  static async searchScholarships(searchTerm: string): Promise<ScholarshipData[]> {
    try {
      const snapshot = await db
        .collection('scholarships')
        .where('isActive', '==', true)
        .get();

      const scholarships: ScholarshipData[] = [];
      const lowerSearchTerm = searchTerm.toLowerCase();

      snapshot.forEach((doc) => {
        const data = doc.data();
        const title = (data.title || '').toLowerCase();
        const description = (data.description || '').toLowerCase();
        const organization = (data.organizationName || '').toLowerCase();
        const category = (data.category || '').toLowerCase();

        if (
          title.includes(lowerSearchTerm) ||
          description.includes(lowerSearchTerm) ||
          organization.includes(lowerSearchTerm) ||
          category.includes(lowerSearchTerm)
        ) {
          scholarships.push({
            id: doc.id,
            ...data,
          } as ScholarshipData);
        }
      });

      return scholarships;
    } catch (error) {
      logger.error('Error searching scholarships:', error);
      throw new AppError('Failed to search scholarships', 500);
    }
  }
}
