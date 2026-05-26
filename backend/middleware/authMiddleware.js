import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Check if header contains Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_123456');

      // Fetch user from DB and bind to request object
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User associated with this token no longer exists.' });
      }

      return next();
    } catch (error) {
      console.error('Authentication token error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token signature verification failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, access token missing' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden, administrative privileges required' });
  }
};
