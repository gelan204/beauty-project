import { Router } from 'express';
import {
  createAppointment,
  getAvailability,
  getMyAppointments,
  getSalonAppointments,
  getStaffAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  rescheduleAppointment,
  getAppointmentById,
} from '../controllers/appointmentController.js';
import { auth } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import {
  createAppointmentSchema,
  rescheduleSchema,
  updateStatusSchema,
} from '../validators/schemas.js';

const router = Router();

router.get('/availability', getAvailability);
router.post('/', auth, authorize('customer'), validate(createAppointmentSchema), createAppointment);
router.get('/mine', auth, authorize('customer'), getMyAppointments);
router.get('/salon', auth, authorize('owner'), getSalonAppointments);
router.get('/staff', auth, authorize('staff'), getStaffAppointments);
router.get('/admin/all', auth, authorize('admin'), getAllAppointments);
router.get('/:id', auth, getAppointmentById);
router.patch('/:id/status', auth, validate(updateStatusSchema), updateAppointmentStatus);
router.patch('/:id/reschedule', auth, authorize('customer'), validate(rescheduleSchema), rescheduleAppointment);

export default router;
