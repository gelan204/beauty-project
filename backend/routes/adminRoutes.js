import { Router } from 'express';
import {
  getDashboardStats,
  getOwnerDashboardStats,
  getAnalytics,
  getReviews,
  replyToReview,
} from '../controllers/adminController.js';
import { auth } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.get('/stats', auth, authorize('admin'), getDashboardStats);
router.get('/analytics', auth, authorize('admin'), getAnalytics);
router.get('/owner/dashboard', auth, authorize('owner'), getOwnerDashboardStats);
router.get('/owner/reviews', auth, authorize('owner'), getReviews);
router.patch('/owner/reviews/:id/reply', auth, authorize('owner'), replyToReview);

export default router;
