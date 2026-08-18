import { Router } from 'express';
import {
  getSalons,
  getSalonById,
  getMySalon,
  updateMySalon,
  uploadSalonImages,
  getPendingSalons,
  updateSalonStatus,
  toggleFavorite,
  getFavorites,
  getAllSalonsAdmin,
} from '../controllers/salonController.js';
import { auth } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import { salonSchema } from '../validators/schemas.js';

const router = Router();

router.get('/', getSalons);
router.get('/favorites/list', auth, authorize('customer'), getFavorites);
router.get('/mine', auth, authorize('owner'), getMySalon);
router.patch('/mine', auth, authorize('owner'), validate(salonSchema), updateMySalon);
router.post('/mine/images', auth, authorize('owner'), upload.array('images', 10), uploadSalonImages);
router.get('/admin/all', auth, authorize('admin'), getAllSalonsAdmin);
router.get('/admin/pending', auth, authorize('admin'), getPendingSalons);
router.patch('/admin/:id/status', auth, authorize('admin'), updateSalonStatus);
router.post('/:salonId/favorite', auth, authorize('customer'), toggleFavorite);
router.get('/:id', getSalonById);

export default router;
