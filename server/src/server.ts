import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { syncDatabase } from './models/index.js';

import authRoutes from './routes/auth.js';
import goalRoutes from './routes/goals.js';
import expenseRoutes from './routes/expenses.js';
import paymentRoutes from './routes/payments.js';
import subscriptionRoutes from './routes/subscription.js';

dotenv.config();

const app = express();
let PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Gullakgo Backend Express + Sequelize ORM Server is running 🔥' });
});

const listenOnPort = (portToTry: number) => {
  const server = app.listen(portToTry, () => {
    console.log(`🚀 Gullakgo Sequelize Express Server running on http://localhost:${portToTry}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${portToTry} is in use. Trying port ${portToTry + 1}...`);
      listenOnPort(portToTry + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

// Initialize DB and start server
const startServer = async () => {
  await connectDB();
  await syncDatabase();
  listenOnPort(PORT);
};

startServer();
