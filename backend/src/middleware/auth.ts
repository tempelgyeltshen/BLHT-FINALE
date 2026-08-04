import type { RequestHandler } from 'express';
import { verifyAccessToken } from '../services/authService.js';
import { AppError } from '../errors/AppError.js';

export interface AuthRequest {
  user?: {
    email: string;
    role: 'admin';
  };
}

export const requireAdmin: RequestHandler = (req, _res, next) => {
  try {
    // ONLY accept HttpOnly cookie
    const token = req.cookies?.blht_access;

    if (!token) {
      return next(new AppError(401, 'Authentication required.'));
    }

    const payload = verifyAccessToken(token);

    if (!payload.email) {
      return next(new AppError(401, 'Invalid access token.'));
    }

    if (payload.role !== 'admin') {
      return next(new AppError(403, 'Administrator access required.'));
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: 'admin',
    };

    next();
  } catch {
    return next(new AppError(401, 'Invalid or expired access token.'));
  }
};