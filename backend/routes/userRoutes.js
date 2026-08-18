import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getUsers,
  getUserById,
  updateUserStatus,
} from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../validators/schemas.js';

const router = Router();

router.get('/me', auth, getProfile);
router.patch('/me', auth, validate(updateProfileSchema), updateProfile);
router.get('/', auth, authorize('admin'), getUsers);
router.get('/:id', auth, authorize('admin'), getUserById);
router.patch('/:id', auth, authorize('admin'), updateUserStatus);

export default router;
