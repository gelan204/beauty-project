import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { auth } from '../middleware/auth.js';
import { registerSchema, loginSchema } from '../validators/schemas.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', auth, logout);
router.get('/me', auth, getMe);

export default router;
