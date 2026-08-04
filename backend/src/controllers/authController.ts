import type { CookieOptions, NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';
import { AppError } from '../errors/AppError.js';
import { authenticateAdmin, issueTokens, verifyAccessToken, verifyRefreshToken } from '../services/authService.js';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'lax',
  path: '/'
};

const setSessionCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie('blht_access', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000 // 15 minutes
  });
  res.cookie('blht_refresh', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const admin = await authenticateAdmin(req.body.email, req.body.password);
    const tokens = issueTokens(admin);
    setSessionCookies(res, tokens.accessToken, tokens.refreshToken);
    res.status(200).json({ data: { user: admin } });
  } catch (error) {
    next(error);
  }
}

export function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.blht_refresh || req.body.refreshToken || '';
    const payload = verifyRefreshToken(token);
    
    if (payload.role !== 'admin') {
      throw new AppError(401, 'Invalid refresh token.');
    }
    
    const admin = {
      id: payload.sub,
      email: payload.email,
      role: 'admin' as const
    };
    
    const tokens = issueTokens(admin);
    setSessionCookies(res, tokens.accessToken, tokens.refreshToken);
    res.json({ data: { user: admin } });
  } catch {
    next(new AppError(401, 'Invalid or expired refresh token.'));
  }
}

export function me(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.blht_access || req.header('authorization')?.replace(/^Bearer\s+/i, '');
    
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
    next(error);
  }
}

export function logout(_req: Request, res: Response) {
  res.clearCookie('blht_access', cookieOptions);
  res.clearCookie('blht_refresh', cookieOptions);
  res.status(204).end();
}
