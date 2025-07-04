import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { validateBody } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';
import { authLimiter, registerLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/register', registerLimiter, validateBody(registerSchema), register);
router.post('/login', authLimiter, validateBody(loginSchema), login);
router.get('/profile', authenticateToken, getProfile);

export default router;
