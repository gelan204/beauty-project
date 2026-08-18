import { Router } from 'express';
import {
  getStaffBySalon,
  getMyStaffProfile,
  createStaff,
  updateStaff,
  deleteStaff,
  updateMyAvailability,
  getAllStaffAdmin,
} from '../controllers/staffController.js';
import { auth } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { staffSchema } from '../validators/schemas.js';

const router = Router();

router.get('/salon/:salonId', getStaffBySalon);
router.get('/me', auth, authorize('staff'), getMyStaffProfile);
router.patch('/me/availability', auth, authorize('staff'), updateMyAvailability);
router.get('/admin/all', auth, authorize('admin'), getAllStaffAdmin);
router.post('/', auth, authorize('owner'), validate(staffSchema), createStaff);
router.patch('/:id', auth, authorize('owner'), validate(staffSchema), updateStaff);
router.delete('/:id', auth, authorize('owner'), deleteStaff);

export default router;
