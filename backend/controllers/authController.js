import User from '../models/User.js';
import Salon from '../models/Salon.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';
import { signToken, setTokenCookie, clearTokenCookie } from '../services/authService.js';

export const register = catchAsync(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, 'Email already registered');

  const allowedRole = role === 'owner' ? 'owner' : 'customer';
  const user = await User.create({ name, email, password, phone, role: allowedRole });

  if (allowedRole === 'owner') {
    await Salon.create({
      ownerId: user._id,
      name: `${name}'s Salon`,
      status: 'pending',
      location: { city: '', area: '' },
    });
  }

  const token = signToken(user._id);
  setTokenCookie(res, token);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
      },
    },
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken(user._id);
  setTokenCookie(res, token);

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
      },
    },
  });
});

export const logout = catchAsync(async (req, res) => {
  clearTokenCookie(res);
  res.json({ success: true, message: 'Logged out successfully' });
});

export const getMe = catchAsync(async (req, res) => {
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
