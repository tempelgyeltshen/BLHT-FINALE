import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import './setup.js'; // Import setup first to configure mocks
import { app } from '../../app/app.js';

describe('Health Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/api/health')
        .expect(200);

      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('environment');
    });
  });

  describe('GET /api/ready', () => {
    it('should return readiness status', async () => {
      const res = await request(app)
        .get('/api/ready')
        .expect(200);

      expect(res.body).toHaveProperty('status', 'ready');
      expect(res.body).toHaveProperty('timestamp');
    });
  });
});

describe('404 Handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app)
      .get('/api/unknown-route')
      .expect(404);

    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Route not found');
  });
});

describe('CORS', () => {
  // Regression: the frontend runs cross-origin (VITE_API_URL=localhost:4000) and
  // reads the CSRF token from the x-csrf-token response header. Without
  // Access-Control-Expose-Headers, browser JS can't read it, so every admin
  // write failed with 403 'Invalid CSRF token'.
  it('should expose the x-csrf-token header for cross-origin clients', async () => {
    const res = await request(app)
      .get('/api/auth/csrf-token')
      .set('Origin', 'http://localhost:3000');

    expect(res.headers['access-control-expose-headers']).toContain('x-csrf-token');
    expect(res.headers['x-csrf-token']).toBeDefined();
  });

  it('should allow the frontend origin', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:3000');

    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });
});
