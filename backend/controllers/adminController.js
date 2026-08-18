import User from '../models/User.js';
import Salon from '../models/Salon.js';
import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';
import Review from '../models/Review.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getDashboardStats = catchAsync(async (req, res) => {
  const [totalSalons, customers, owners, admins, bookings, revenueAgg, pendingSalons] =
    await Promise.all([
      Salon.countDocuments({ status: 'approved' }),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'owner' }),
      User.countDocuments({ role: 'admin' }),
      Appointment.countDocuments(),
      Appointment.aggregate([
        { $match: { status: { $in: ['confirmed', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$price' } } },
      ]),
      Salon.countDocuments({ status: 'pending' }),
    ]);

  const revenue = revenueAgg[0]?.total || 0;

  const last7Days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date();
    day.setDate(day.getDate() - i);
    day.setHours(0, 0, 0, 0);
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    // eslint-disable-next-line no-await-in-loop
    const count = await Appointment.countDocuments({
      createdAt: { $gte: day, $lt: next },
    });
    last7Days.push(count);
  }

  res.json({
    success: true,
    data: {
      stats: {
        totalSalons,
        customers,
        owners,
        admins,
        bookings,
        revenue,
        pendingSalons,
      },
      bookingVolume: last7Days,
    },
  });
});

export const getOwnerDashboardStats = catchAsync(async (req, res) => {
  const salon = await Salon.findOne({ ownerId: req.user._id });
  if (!salon) {
    return res.json({
      success: true,
      data: {
        stats: { todayAppointments: 0, weeklyRevenue: 0, newReviews: 0, occupancy: 0 },
        todaySchedule: [],
      },
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [todayAppointments, weeklyRevenueAgg, reviews, todaySchedule, pendingCount] =
    await Promise.all([
      Appointment.countDocuments({
        salonId: salon._id,
        date: { $gte: today, $lt: tomorrow },
        status: { $in: ['pending', 'confirmed', 'completed'] },
      }),
      Appointment.aggregate([
        {
          $match: {
            salonId: salon._id,
            status: { $in: ['confirmed', 'completed'] },
            createdAt: { $gte: weekAgo },
          },
        },
        { $group: { _id: null, total: { $sum: '$price' } } },
      ]),
      Review.countDocuments({ salonId: salon._id, createdAt: { $gte: weekAgo } }),
      Appointment.find({
        salonId: salon._id,
        date: { $gte: today, $lt: tomorrow },
      })
        .populate('customerId', 'name')
        .populate('staffId', 'name')
        .populate('serviceId', 'name')
        .sort({ startTime: 1 }),
      Appointment.countDocuments({ salonId: salon._id, status: 'pending' }),
    ]);

  res.json({
    success: true,
    data: {
      stats: {
        todayAppointments,
        weeklyRevenue: weeklyRevenueAgg[0]?.total || 0,
        newReviews: reviews,
        occupancy: Math.min(100, todayAppointments * 8),
        pendingCount,
        rating: salon.rating,
      },
      todaySchedule,
      salon,
    },
  });
});

export const getAnalytics = catchAsync(async (req, res) => {
  const serviceStats = await Appointment.aggregate([
    { $match: { status: { $in: ['confirmed', 'completed'] } } },
    { $group: { _id: '$serviceId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  const populated = await Promise.all(
    serviceStats.map(async (item) => {
      const service = await Service.findById(item._id).select('name');
      return { name: service?.name || 'Unknown', count: item.count };
    })
  );

  const total = populated.reduce((sum, s) => sum + s.count, 0) || 1;
  const popularity = populated.map((s) => ({
    name: s.name,
    percentage: Math.round((s.count / total) * 100),
  }));

  res.json({
    success: true,
    data: {
      servicePopularity: popularity,
      peakHours: [25, 46, 85, 72, 52],
    },
  });
});

export const getReviews = catchAsync(async (req, res) => {
  const salon = await Salon.findOne({ ownerId: req.user._id });
  if (!salon) {
    return res.json({ success: true, data: { reviews: [], rating: 0, count: 0 } });
  }

  const reviews = await Review.find({ salonId: salon._id })
    .populate('customerId', 'name')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: { reviews, rating: salon.rating, count: salon.reviewCount },
  });
});

export const replyToReview = catchAsync(async (req, res) => {
  const salon = await Salon.findOne({ ownerId: req.user._id });
  const review = await Review.findOne({ _id: req.params.id, salonId: salon?._id });
  if (!review) throw new ApiError(404, 'Review not found');

  review.reply = req.body.reply || '';
  await review.save();
  res.json({ success: true, data: { review } });
});
