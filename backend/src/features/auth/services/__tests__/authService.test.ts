import { describe, it, expect, beforeAll, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Set env before importing the module under test
process.env.JWT_ACCESS_SECRET = 'test-secret-that-is-at-least-32-characters-long!';
process.env.ADMIN_EMAIL = 'admin@test.com';
process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync('password123', 10);
process.env.NODE_ENV = 'development';

const { authenticateAdmin, issueAccessToken, verifyAccessToken } = await import('../authService.js');
const { AppError } = await import('../../../../core/errors/AppError.js');

describe('authService', () => {
  describe('authenticateAdmin', () => {
    it('should authenticate with valid credentials', async () => {
      const admin = await authenticateAdmin('admin@test.com', 'password123');
      expect(admin).toEqual({
        id: 'blht-admin',
        email: 'admin@test.com',
        role: 'admin'
      });
    });

    it('should throw 401 for wrong password', async () => {
      await expect(authenticateAdmin('admin@test.com', 'wrongpassword'))
        .rejects.toThrow('Invalid email or password');
    });

    it('should throw 401 for unknown email', async () => {
      await expect(authenticateAdmin('unknown@test.com', 'password123'))
        .rejects.toThrow('Invalid email or password');
    });

    it('should throw 401 for empty credentials', async () => {
      await expect(authenticateAdmin('', ''))
        .rejects.toThrow('Invalid email or password');
    });

    it('should be case-insensitive for email', async () => {
      const admin = await authenticateAdmin('ADMIN@TEST.COM', 'password123');
      expect(admin.email).toBe('admin@test.com');
    });
  });

  describe('issueAccessToken', () => {
    it('should return a valid JWT string', () => {
      const admin = { id: 'test-id', email: 'test@test.com', role: 'admin' as const };
      const token = issueAccessToken(admin);
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should encode admin info in the token', () => {
      const admin = { id: 'test-id', email: 'test@test.com', role: 'admin' as const };
      const token = issueAccessToken(admin);
      const decoded = jwt.decode(token) as any;
      expect(decoded.sub).toBe('test-id');
      expect(decoded.email).toBe('test@test.com');
      expect(decoded.role).toBe('admin');
    });

    it('should set 15-minute expiry', () => {
      const admin = { id: 'test-id', email: 'test@test.com', role: 'admin' as const };
      const token = issueAccessToken(admin);
      const decoded = jwt.decode(token) as any;
      expect(decoded.exp - decoded.iat).toBe(900); // 15 minutes = 900 seconds
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid token', () => {
      const admin = { id: 'test-id', email: 'test@test.com', role: 'admin' as const };
      const token = issueAccessToken(admin);
      const payload = verifyAccessToken(token);
      expect(payload.sub).toBe('test-id');
      expect(payload.email).toBe('test@test.com');
      expect(payload.role).toBe('admin');
    });

    it('should throw for invalid token', () => {
      expect(() => verifyAccessToken('invalid-token')).toThrow();
    });

    it('should throw for token signed with wrong secret', () => {
      const token = jwt.sign(
        { sub: 'id', email: 'e@e.com', role: 'admin' },
        'wrong-secret-key-that-is-also-32-chars!!'
      );
      expect(() => verifyAccessToken(token)).toThrow();
    });

    it('should throw for expired token', () => {
      const token = jwt.sign(
        { sub: 'id', email: 'e@e.com', role: 'admin' },
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: '-1s' } // Already expired
      );
      expect(() => verifyAccessToken(token)).toThrow();
    });
  });
});
