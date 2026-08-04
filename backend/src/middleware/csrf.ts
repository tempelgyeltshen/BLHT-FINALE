import type { RequestHandler } from 'express';
import crypto from 'crypto';

declare global {
  namespace Express {
    interface Request {
      csrfToken?: () => string;
    }
  }
}

// Generate a random CSRF token
const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Validate CSRF token
const validateToken = (token: string, sessionToken: string): boolean => {
  return token === sessionToken && token.length > 0;
};

// CSRF protection middleware
export const csrfProtection: RequestHandler = (req, res, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Get CSRF token from request header (preferred) or body/query
  const token = req.headers['x-csrf-token'] as string || 
                req.body._csrf || 
                req.query._csrf;

  // Get session token from cookie
  const sessionToken = req.cookies?.csrf_token;

  if (!token || !sessionToken || !validateToken(token, sessionToken)) {
    return res.status(403).json({ 
      error: { message: 'Invalid CSRF token' } 
    });
  }

  next();
};

// CSRF token generation middleware
export const csrfToken: RequestHandler = (req, res, next) => {
  const token = req.cookies?.csrf_token || generateToken();
  
  // Set CSRF token in cookie (httpOnly for security)
  res.cookie('csrf_token', token, {
    httpOnly: true, // Prevent JavaScript access for security
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  // Add method to request to get token
  req.csrfToken = () => token;
  
  // Also set token in response header for frontend access
  res.setHeader('X-CSRF-Token', token);
  
  next();
};