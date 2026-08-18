import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getProfile = catchAsync(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        profileImage: req.user.profileImage,
      },
    },
  });
});

export const updateProfile = catchAsync(async (req, res) => {
  const allowed = ['name', 'phone', 'profileImage'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) req.user[field] = req.body[field];
  });

  await req.user.save();

  res.json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        profileImage: req.user.profileImage,
      },
    },
  });
});

export const getUsers = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(Number(req.query.limit) || 50);

  res.json({ success: true, data: { users } });
});

export const getUserById = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, data: { user } });
});

export const updateUserStatus = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  if (req.body.role && req.user.role === 'admin') {
    user.role = req.body.role;
  }

  await user.save();
  res.json({ success: true, data: { user } });
});
