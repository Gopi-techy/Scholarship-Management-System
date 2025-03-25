import { Router } from 'express';
import multer from 'multer';
import { auth } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { uploadDocumentSchema } from '../schemas/document.schema';
import {
  uploadDocument,
  getDocuments,
  getDocument,
  verifyDocument,
  deleteDocument
} from '../controllers/documents';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype.startsWith('image/')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'));
    }
  }
});

const router = Router();

router.post(
  '/',
  auth,
  upload.single('file'),
  validate(uploadDocumentSchema),
  uploadDocument
);

router.get('/', auth, getDocuments);
router.get('/:id', auth, getDocument);
router.patch('/:id/verify', auth, authorizeRoles('admin'), verifyDocument);
router.delete('/:id', auth, deleteDocument);

export default router; 