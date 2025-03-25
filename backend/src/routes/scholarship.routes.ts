import express from 'express';
import { ScholarshipController } from '../controllers/scholarship';
import { validateSchema } from '../middleware/validate.middleware';
import { scholarshipSchema } from '../schemas/scholarship.schema';

const router = express.Router();

// All routes are public for now
router.get('/', ScholarshipController.getScholarships);
router.get('/:id', ScholarshipController.getScholarship);
router.post('/', validateSchema(scholarshipSchema), ScholarshipController.createScholarship);
router.put('/:id', validateSchema(scholarshipSchema), ScholarshipController.updateScholarship);
router.delete('/:id', ScholarshipController.deleteScholarship);
router.post('/:id/apply', ScholarshipController.applyForScholarship);

export default router; 