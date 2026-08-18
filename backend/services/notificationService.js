import Notification from '../models/Notification.js';

export const createNotification = async ({ userId, type, title, message, metadata = {} }) => {
  return Notification.create({ userId, type, title, message, metadata });
};

export const notifyUsers = async (users, payload) => {
  const docs = users.map((userId) => ({ userId, ...payload }));
  if (docs.length) await Notification.insertMany(docs);
};
