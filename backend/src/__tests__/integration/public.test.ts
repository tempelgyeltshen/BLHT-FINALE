import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import './setup.js'; // Import setup first to configure mocks
import { app } from '../../app/app.js';
import { clearCollections, seedCollection } from './setup.js';

describe('Public API Endpoints', () => {
  beforeEach(() => {
    clearCollections();
  });

  describe('GET /api/search', () => {
    it('should return search results', async () => {
      // Seed some data
      seedCollection('packages', [
        {
          name: 'Bhutan Adventure Tour',
          description: 'An exciting adventure through Bhutan',
          duration: '7 days',
          price: 2500,
          category: 'adventure',
          region: 'Western Bhutan'
        },
        {
          name: 'Cultural Heritage Tour',
          description: 'Explore Bhutanese culture and traditions',
          duration: '5 days',
          price: 1800,
          category: 'cultural',
          region: 'Central Bhutan'
        }
      ]);

      const res = await request(app)
        .get('/api/search?q=adventure')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should return 400 without query', async () => {
      await request(app)
        .get('/api/search')
        .expect(400);
    });

    it('should return 400 with empty query', async () => {
      await request(app)
        .get('/api/search?q=')
        .expect(400);
    });
  });

  describe('GET /api/dashboard', () => {
    it('should return 401 without auth', async () => {
      await request(app)
        .get('/api/dashboard')
        .expect(401);
    });

    it('should return dashboard stats with auth', async () => {
      // Seed some data
      seedCollection('packages', [
        {
          name: 'Test Package 1',
          description: 'Test package 1',
          duration: '5 days',
          price: 1500,
          category: 'adventure',
          region: 'Western Bhutan'
        }
      ]);

      seedCollection('hotels', [
        {
          name: 'Test Hotel',
          description: 'A test hotel',
          brand: 'Test Brand',
          region: 'Western Bhutan',
          images: ['https://example.com/hotel.jpg']
        }
      ]);

      // Login to get token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'password123'
        });

      const token = loginRes.body.token;

      const res = await request(app)
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('packages');
      expect(res.body.data).toHaveProperty('hotels');
      expect(res.body.data.packages).toBe(1);
      expect(res.body.data.hotels).toBe(1);
    });
  });
});
