import { Router } from 'express';
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  reviewApplication,
  submitApplication,
  addComment
} from '../controllers/applications';

const router = Router();

// All routes are public for now
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.post('/', createApplication);
router.put('/:id/status', updateApplicationStatus);
router.post('/:id/review', reviewApplication);
router.post('/:id/submit', submitApplication);
router.post('/:id/comments', addComment);

export default router; 