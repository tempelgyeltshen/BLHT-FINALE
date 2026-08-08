import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../../../core/errors/AppError.js';
import { authenticateAdmin, issueAccessToken, verifyAccessToken } from '../services/authService.js';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const admin = await authenticateAdmin(req.body.email, req.body.password);
    const token = issueAccessToken(admin);
    res.status(200).json({
      token,
      user: admin
    });
  } catch (error) {
    next(error);
  }
}

export function me(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header('authorization')?.replace(/^Bearer\s+/i, '');

    if (!token) {
      throw new AppError(401, 'Authentication required.');
    }

    const payload = verifyAccessToken(token);
    res.json({
      data: {
        user: {
          id: payload.sub,
          email: payload.email,
          role: payload.role
        }
      }
    });
  } catch (error) {
    // verifyAccessToken throws JsonWebTokenError for invalid/expired tokens —
    // normalize to a 401 so the frontend interceptor can react correctly
    next(error instanceof AppError ? error : new AppError(401, 'Invalid or expired access token.'));
  }
}

export function logout(_req: Request, res: Response) {
  res.status(204).end();
}
