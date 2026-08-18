import { Router } from 'express';
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getSalonServices,
  adminToggleService,
  getAllServicesAdmin,
} from '../controllers/serviceController.js';
import { auth } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { serviceSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', getServices);
router.get('/admin/all', auth, authorize('admin'), getAllServicesAdmin);
router.get('/salon/:salonId', getSalonServices);
router.post('/', auth, authorize('owner'), validate(serviceSchema), createService);
router.patch('/admin/:id/toggle', auth, authorize('admin'), adminToggleService);
router.patch('/:id', auth, authorize('owner'), validate(serviceSchema), updateService);
router.delete('/:id', auth, authorize('owner'), deleteService);
router.get('/:id', getServiceById);

export default router;
