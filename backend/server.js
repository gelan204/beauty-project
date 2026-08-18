import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const start = async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Elaris API running on http://localhost:${env.port}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
