import rateLimit from 'express-rate-limit';
import { config, logger } from '@one-stop-book/common';

// For development: Use in-memory rate limiting
// For production: Configure Redis properly
logger.info('Rate limiting configured for development (in-memory store)');

// Public routes rate limiter (100 req/min)
export const publicRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: config.rateLimit.public,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Authenticated routes rate limiter (20 req/min)
export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: config.rateLimit.auth,
  message: 'Too many requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin routes rate limiter (50 req/min)
export const adminRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: config.rateLimit.admin,
  message: 'Too many admin requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});
