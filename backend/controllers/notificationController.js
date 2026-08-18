import Notification from '../models/Notification.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getNotifications = catchAsync(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({ success: true, data: { notifications } });
});

export const markAsRead = catchAsync(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!notification) throw new ApiError(404, 'Notification not found');

  notification.read = true;
  await notification.save();
  res.json({ success: true, data: { notification } });
});

export const markAllRead = catchAsync(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
  res.json({ success: true, message: 'All notifications marked as read' });
});
