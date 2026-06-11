import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Load Environment variables
dotenv.config();

// Establish Database Connection
connectDB();

const app = express();

// Standard Middlewares
app.use(cors());
app.use(express.json());

// Rewrite Vercel stripped '/api' prefix to match API routes
app.use((req, res, next) => {
  if (!req.url.startsWith('/api') && req.url !== '/') {
    req.url = '/api' + req.url;
  }
  next();
});

// API Route Mountpoints
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Root Ping Route
app.use('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'E-Commerce Backend REST APIs are active' });
});

// Serve frontend static assets if in production (handled by Vercel static routing, but nice to have)
app.get('/', (req, res) => {
  res.send('API is running successfully. Access frontend on port 5173 or deploy both to Vercel.');
});

// Centralized 404 Route handler
app.use((req, res, next) => {
  const error = new Error(`Resource Not Found - Cannot ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Centralized Error-handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server launched in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;
