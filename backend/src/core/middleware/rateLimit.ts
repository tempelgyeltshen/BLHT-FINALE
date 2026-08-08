import rateLimit from 'express-rate-limit';
import type { Request } from 'express';
import { RATE_LIMIT } from '../config/constants.js';

// Skip the global limiter for authenticated admin requests: they are already
// protected by JWT auth + CSRF, and the admin dashboard issues many API calls
// on every page load (7 CMS collections + auth + CSRF + signature requests),
// which exhausted the previous 100/15min budget and broke all uploads.
const skipAuthenticated = (req: Request): boolean => {
  return Boolean(req.headers.authorization?.startsWith('Bearer '));
};

export const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT.api.windowMs,

  max: RATE_LIMIT.api.max,

  skip: skipAuthenticated,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});
