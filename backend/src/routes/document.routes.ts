import { Router } from 'express';
import {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
  verifyDocument
} from '../controllers/documents';
import { auth } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();

// All routes require authentication
router.use(auth);

// Student routes
router.post('/upload', uploadDocument);
router.get('/', getDocuments);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);

// Admin routes
router.post('/:id/verify', authorizeRoles('admin'), verifyDocument);

export default router;
