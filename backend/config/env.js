import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elaris',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrls: (process.env.CLIENT_URLS || 'http://localhost:5173').split(',').map((u) => u.trim()),
  uploadPath: process.env.UPLOAD_PATH || './uploads',
};
