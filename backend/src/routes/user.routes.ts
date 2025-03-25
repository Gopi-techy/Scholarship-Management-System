import express from 'express';
import { UserController } from '../controllers/user';
import { validateSchema } from '../middleware/validate.middleware';
import { userSchema } from '../schemas/user.schema';

const router = express.Router();

// All routes are public for now
router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUser);
router.put('/:id', validateSchema(userSchema), UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.post('/fcm-token', UserController.updateFcmToken);

export default router; 