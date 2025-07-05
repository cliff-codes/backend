import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { validateBody } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { registerSchema, loginSchema } from '../schemas/authSchemas';
import { authLimiter, registerLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/register', registerLimiter, validateBody(registerSchema), register);
router.post('/login', authLimiter, validateBody(loginSchema), login);
router.get('/profile', authenticateToken, getProfile);

export default router;
