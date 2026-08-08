import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import './setup.js';
import { app } from '../../app/app.js';
import { clearCollections } from './setup.js';

// Pre-login once to avoid rate limiter (5/15min)
let cachedToken = '';

beforeAll(async () => {
  clearCollections();
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'password123' });
  cachedToken = res.body.token;
});

describe('Auth Endpoints', () => {
  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', password: 'password123' })
        .expect(200);

      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', 'admin@test.com');
      expect(res.body.user).toHaveProperty('role', 'admin');
      expect(typeof res.body.token).toBe('string');
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', password: 'wrongpassword' })
        .expect(401);

      expect(res.body).toHaveProperty('error');
    });

    it('should reject missing email', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' })
        .expect(400);
    });

    it('should reject missing password', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@test.com' })
        .expect(400);
    });

    it('should reject invalid email format', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'not-an-email', password: 'password123' })
        .expect(400);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 without token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(res.body).toHaveProperty('error');
    });

    it('should return user with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${cachedToken}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user).toHaveProperty('email', 'admin@test.com');
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      await request(app)
        .post('/api/auth/logout')
        .expect(204);
    });
  });
});
