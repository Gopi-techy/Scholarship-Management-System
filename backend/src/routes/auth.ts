import express from 'express';
import { AuthController } from '../controllers/auth';
import { validateSchema } from '../middleware/validate.middleware';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

const router = express.Router();

router.post('/register', validateSchema(registerSchema), AuthController.register);
router.post('/login', validateSchema(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);

export default router; 