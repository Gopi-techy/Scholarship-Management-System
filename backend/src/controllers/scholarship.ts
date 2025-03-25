import { Request, Response, NextFunction } from 'express';
import { ScholarshipService } from '../services/scholarship.service';
import { AppError } from '../utils/error';

export class ScholarshipController {
  static async createScholarship(req: Request, res: Response, next: NextFunction) {
    try {
      const scholarship = await ScholarshipService.createScholarship(req.body);
      res.status(201).json({ scholarship });
    } catch (error) {
      next(error);
    }
  }

  static async getScholarships(_req: Request, res: Response, next: NextFunction) {
    try {
      const scholarships = await ScholarshipService.getScholarships();
      res.json({ scholarships });
    } catch (error) {
      next(error);
    }
  }

  static async getScholarship(req: Request, res: Response, next: NextFunction) {
    try {
      const scholarship = await ScholarshipService.getScholarship(req.params.id);
      if (!scholarship) {
        throw new AppError('Scholarship not found', 404);
      }
      res.json({ scholarship });
    } catch (error) {
      next(error);
    }
  }

  static async updateScholarship(req: Request, res: Response, next: NextFunction) {
    try {
      const scholarship = await ScholarshipService.updateScholarship(req.params.id, req.body);
      res.json({ scholarship });
    } catch (error) {
      next(error);
    }
  }

  static async deleteScholarship(req: Request, res: Response, next: NextFunction) {
    try {
      await ScholarshipService.deleteScholarship(req.params.id);
      res.json({ message: 'Scholarship deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async applyForScholarship(req: Request, res: Response, next: NextFunction) {
    try {
      const application = await ScholarshipService.applyForScholarship(req.params.id, req.body);
      res.status(201).json({ application });
    } catch (error) {
      next(error);
    }
  }
} 