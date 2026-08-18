import Staff from '../models/Staff.js';
import User from '../models/User.js';
import Salon from '../models/Salon.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

const getOwnerSalon = async (ownerId) => {
  const salon = await Salon.findOne({ ownerId });
  if (!salon) throw new ApiError(404, 'Salon not found');
  return salon;
};

export const getStaffBySalon = catchAsync(async (req, res) => {
  const staff = await Staff.find({ salonId: req.params.salonId, status: { $ne: 'inactive' } }).populate(
    'services'
  );
  res.json({ success: true, data: { staff } });
});

export const getMyStaffProfile = catchAsync(async (req, res) => {
  const staff = await Staff.findOne({ userId: req.user._id }).populate('services salonId');
  if (!staff) throw new ApiError(404, 'Staff profile not found');
  res.json({ success: true, data: { staff } });
});

export const createStaff = catchAsync(async (req, res) => {
  const salon = await getOwnerSalon(req.user._id);
  const { email, password, ...staffData } = req.body;

  let userId;
  if (email && password) {
    const existing = await User.findOne({ email });
    if (existing) throw new ApiError(409, 'Email already in use');

    const user = await User.create({
      name: staffData.name,
      email,
      password,
      role: 'staff',
    });
    userId = user._id;
  }

  const staff = await Staff.create({ ...staffData, salonId: salon._id, userId });
  res.status(201).json({ success: true, data: { staff } });
});

export const updateStaff = catchAsync(async (req, res) => {
  const salon = await getOwnerSalon(req.user._id);
  const staff = await Staff.findOne({ _id: req.params.id, salonId: salon._id });
  if (!staff) throw new ApiError(404, 'Staff member not found');

  const { email, password, ...updates } = req.body;
  Object.assign(staff, updates);
  await staff.save();

  res.json({ success: true, data: { staff } });
});

export const deleteStaff = catchAsync(async (req, res) => {
  const salon = await getOwnerSalon(req.user._id);
  const staff = await Staff.findOneAndDelete({ _id: req.params.id, salonId: salon._id });
  if (!staff) throw new ApiError(404, 'Staff member not found');
  res.json({ success: true, message: 'Staff member removed' });
});

export const updateMyAvailability = catchAsync(async (req, res) => {
  const staff = await Staff.findOne({ userId: req.user._id });
  if (!staff) throw new ApiError(404, 'Staff profile not found');

  if (req.body.availability) staff.availability = req.body.availability;
  if (req.body.status) staff.status = req.body.status;
  await staff.save();

  res.json({ success: true, data: { staff } });
});

export const getAllStaffAdmin = catchAsync(async (req, res) => {
  const staff = await Staff.find().populate('salonId', 'name').sort({ createdAt: -1 });
  res.json({ success: true, data: { staff } });
});
