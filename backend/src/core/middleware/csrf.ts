import crypto from 'crypto';
import type { RequestHandler, Request } from 'express';
import { AppError } from '../errors/AppError.js';
import { CSRF } from '../config/constants.js';

const CSRF_TOKEN_LENGTH = CSRF.tokenLength;
const CSRF_HEADER_NAME = CSRF.headerName;

// Store CSRF tokens in memory (in production, use Redis or similar)
const tokenStore = new Map<string, { token: string; expires: number }>();

// Clean up expired tokens every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of tokenStore.entries()) {
    if (data.expires < now) {
      tokenStore.delete(sessionId);
    }
  }
}, CSRF.sweepIntervalMs);

function generateSessionId(): string {
  return crypto.randomBytes(16).toString('hex');
}

function generateCsrfToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

function getSessionId(req: Request): string {
  // Try to get existing session ID from authorization header (use token as session identifier)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token) {
      return token; // Use JWT token as session identifier
    }
  }
  
  // Generate new session ID
  const newSessionId = generateSessionId();
  return newSessionId;
}

export const csrfProtection: RequestHandler = (req, res, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS requests (these are read-only)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const sessionId = getSessionId(req);
  const storedData = tokenStore.get(sessionId);

  // Generate new token if none exists or expired
  if (!storedData || storedData.expires < Date.now()) {
    const newToken = generateCsrfToken();
    const expires = Date.now() + CSRF.ttlMs; // 1 hour
    tokenStore.set(sessionId, { token: newToken, expires });
    
    // Send token in header for frontend to use
    res.setHeader(CSRF_HEADER_NAME, newToken);
  }

  // For state-changing methods, validate CSRF token
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const tokenFromRequest = 
      req.headers[CSRF_HEADER_NAME] as string ||
      req.body?.csrfToken ||
      req.query?.csrfToken;

    const currentTokenData = tokenStore.get(sessionId);
    
    if (!currentTokenData || !tokenFromRequest || tokenFromRequest !== currentTokenData.token) {
      throw new AppError(403, 'Invalid CSRF token');
    }
  }

  next();
};

export const generateCsrfTokenHandler: RequestHandler = (req, res) => {
  const sessionId = getSessionId(req);
  const token = generateCsrfToken();
  const expires = Date.now() + CSRF.ttlMs; // 1 hour
  
  tokenStore.set(sessionId, { token, expires });
  
  // Send token in header
  res.setHeader(CSRF_HEADER_NAME, token);
  
  res.json({ csrfToken: token });
};
