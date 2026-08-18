import Salon from '../models/Salon.js';
import Service from '../models/Service.js';
import Staff from '../models/Staff.js';
import Review from '../models/Review.js';
import Favorite from '../models/Favorite.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { getPublicUrl } from '../middleware/upload.js';

const salonPopulate = [
  { path: 'ownerId', select: 'name email phone' },
];

export const getSalons = catchAsync(async (req, res) => {
  const filter = { status: 'approved' };

  if (req.query.search) {
    const search = req.query.search.trim();
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { 'location.city': new RegExp(search, 'i') },
      { 'location.area': new RegExp(search, 'i') },
    ];
  }

  if (req.query.category) {
    filter.categories = req.query.category;
  }

  if (req.query.city) {
    filter['location.city'] = new RegExp(req.query.city, 'i');
  }

  const salons = await Salon.find(filter).sort({ rating: -1 }).limit(50);
  res.json({ success: true, data: { salons } });
});

export const getSalonById = catchAsync(async (req, res) => {
  const salon = await Salon.findById(req.params.id).populate(salonPopulate);
  if (!salon) throw new ApiError(404, 'Salon not found');

  const [services, staff, reviews] = await Promise.all([
    Service.find({ salonId: salon._id, status: 'active' }),
    Staff.find({ salonId: salon._id, status: { $ne: 'inactive' } }).populate('services'),
    Review.find({ salonId: salon._id }).populate('customerId', 'name').sort({ createdAt: -1 }).limit(10),
  ]);

  res.json({ success: true, data: { salon, services, staff, reviews } });
});

export const getMySalon = catchAsync(async (req, res) => {
  const salon = await Salon.findOne({ ownerId: req.user._id });
  if (!salon) throw new ApiError(404, 'Salon not found for this owner');
  res.json({ success: true, data: { salon } });
});

export const updateMySalon = catchAsync(async (req, res) => {
  const salon = await Salon.findOne({ ownerId: req.user._id });
  if (!salon) throw new ApiError(404, 'Salon not found');

  const fields = ['name', 'description', 'location', 'phone', 'email', 'categories', 'instagram', 'openingHours'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) salon[field] = req.body[field];
  });

  await salon.save();
  res.json({ success: true, data: { salon } });
});

export const uploadSalonImages = catchAsync(async (req, res) => {
  const salon = await Salon.findOne({ ownerId: req.user._id });
  if (!salon) throw new ApiError(404, 'Salon not found');

  const urls = (req.files || []).map((f) => getPublicUrl(f.filename));
  salon.images.push(...urls);
  await salon.save();

  res.json({ success: true, data: { salon } });
});

export const getPendingSalons = catchAsync(async (req, res) => {
  const salons = await Salon.find({ status: 'pending' }).populate('ownerId', 'name email');
  res.json({ success: true, data: { salons } });
});

export const updateSalonStatus = catchAsync(async (req, res) => {
  const salon = await Salon.findById(req.params.id);
  if (!salon) throw new ApiError(404, 'Salon not found');

  salon.status = req.body.status;
  await salon.save();
  res.json({ success: true, data: { salon } });
});

export const toggleFavorite = catchAsync(async (req, res) => {
  const { salonId } = req.params;
  const existing = await Favorite.findOne({ customerId: req.user._id, salonId });

  if (existing) {
    await existing.deleteOne();
    return res.json({ success: true, data: { favorited: false } });
  }

  await Favorite.create({ customerId: req.user._id, salonId });
  res.json({ success: true, data: { favorited: true } });
});

export const getFavorites = catchAsync(async (req, res) => {
  const favorites = await Favorite.find({ customerId: req.user._id }).populate('salonId');
  res.json({ success: true, data: { favorites } });
});

export const getAllSalonsAdmin = catchAsync(async (req, res) => {
  const salons = await Salon.find().populate('ownerId', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, data: { salons } });
});
