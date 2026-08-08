import type { RequestHandler } from 'express';
import { verifyAccessToken } from '../../features/auth/services/authService.js';
import { AppError } from '../errors/AppError.js';
import { AuthenticationError } from '../errors/AuthenticationError.js';

export interface AuthRequest {
  user?: {
    id: string;
    email: string;
    role: 'admin';
  };
}

export const requireAdmin: RequestHandler = (req, _res, next) => {
  try {
    // Accept Authorization header
    const token = req.header('authorization')?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return next(new AuthenticationError('Authentication required.'));
    }

    const payload = verifyAccessToken(token);

    if (!payload.email) {
      return next(new AuthenticationError('Invalid access token.'));
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
    return next(new AuthenticationError('Invalid or expired access token.'));
  }
};
