import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import './setup.js';
import { app } from '../../app/app.js';
import { clearCollections } from './setup.js';

// Get token ONCE before all CMS tests to avoid rate limiter
let adminToken = '';
let csrfToken = '';

const authHeaders = () => ({
  Authorization: `Bearer ${adminToken}`,
  'x-csrf-token': csrfToken
});

beforeAll(async () => {
  clearCollections();
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'password123' });
  adminToken = res.body.token;
  expect(adminToken).toBeDefined();

  // Fetch the CSRF token (keyed to this JWT session) so write
  // requests pass csrfProtection, mirroring the frontend flow.
  const csrfRes = await request(app)
    .get('/api/auth/csrf-token')
    .set('Authorization', `Bearer ${adminToken}`);
  csrfToken = csrfRes.body.csrfToken;
  expect(csrfToken).toBeDefined();
});

// Valid package payload matching packageSchema
const validPackage = {
  title: 'Bhutan Cultural Odyssey',
  subtitle: 'A deep dive into Bhutanese heritage and monasteries',
  category: 'Cultural Tours',
  durationDays: 7,
  priceUSD: 2500,
  rating: 4.8,
  reviewsCount: 42,
  featured: false,
  heroImage: 'https://example.com/hero.jpg',
  galleryImages: ['https://example.com/gallery1.jpg', 'https://example.com/gallery2.jpg'],
  description: 'An immersive journey through the ancient monasteries and vibrant festivals of the Kingdom of Bhutan.',
  highlights: ['Visit Tiger Nest Monastery', 'Explore Punakha Dzong'],
  included: ['Hotel accommodation', 'All meals'],
  excluded: ['International flights', 'Travel insurance'],
  destinations: ['Paro', 'Thimphu', 'Punakha'],
  hotelCategory: 'Boutique Lodge',
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Paro',
      location: 'Paro',
      description: 'Arrival and transfer to your hotel with a scenic drive through the Paro valley.',
      highlights: ['Airport pickup', 'Valley drive']
    }
  ]
};

// Valid homepage payload matching homepageConfigSchema
const validHomepage = {
  heroTitle: 'Welcome to the Land of Happiness',
  heroSubtitle: 'Experience the magic of Bhutan with our curated tours and luxury stays.',
  announcementText: 'Book before December for exclusive winter discounts.',
  announcementLink: '/packages',
  heroVideoUrl: 'https://example.com/hero.mp4',
  featuredPackagesCount: 4,
  statsHeading: 'Bhutan by the numbers',
  stats: [
    { label: 'Years of experience', value: '15+', iconName: 'Award' },
    { label: 'Happy travelers', value: '5000+', iconName: 'Users' }
  ]
};

describe('CMS Endpoints', () => {
  beforeEach(() => {
    clearCollections();
  });

  describe('GET /api/cms/:resource', () => {
    it('should list packages (empty)', async () => {
      const res = await request(app)
        .get('/api/cms/packages')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should return 404 for unknown resource', async () => {
      await request(app)
        .get('/api/cms/unknown')
        .expect(404);
    });
  });

  describe('POST /api/cms/:resource', () => {
    it('should create a package with valid data', async () => {
      const res = await request(app)
        .post('/api/cms/packages')
        .set(authHeaders())
        .send(validPackage)
        .expect(201);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('title', 'Bhutan Cultural Odyssey');
      expect(res.body.data).toHaveProperty('id');
    });

    it('should reject creation without auth', async () => {
      await request(app)
        .post('/api/cms/packages')
        .send(validPackage)
        .expect(401);
    });

    it('should reject creation with invalid data', async () => {
      const invalidData = { title: 'X' }; // too short + missing required fields
      await request(app)
        .post('/api/cms/packages')
        .set(authHeaders())
        .send(invalidData)
        .expect(400);
    });
  });

  describe('PATCH /api/cms/:resource/:id', () => {
    it('should update an existing package', async () => {
      const createRes = await request(app)
        .post('/api/cms/packages')
        .set(authHeaders())
        .send(validPackage)
        .expect(201);

      const packageId = createRes.body.data.id;
      expect(packageId).toBeDefined();

      const updateRes = await request(app)
        .patch(`/api/cms/packages/${packageId}`)
        .set(authHeaders())
        .send({ title: 'Updated Package Title', priceUSD: 3000 })
        .expect(200);

      expect(updateRes.body.data).toHaveProperty('title', 'Updated Package Title');
      expect(updateRes.body.data).toHaveProperty('priceUSD', 3000);
    });

    it('should return 404 for non-existent package', async () => {
      await request(app)
        .patch('/api/cms/packages/non-existent-id')
        .set(authHeaders())
        .send({ title: 'Updated Package Title' })
        .expect(404);
    });
  });

  describe('DELETE /api/cms/:resource/:id', () => {
    it('should delete an existing package', async () => {
      const createRes = await request(app)
        .post('/api/cms/packages')
        .set(authHeaders())
        .send(validPackage)
        .expect(201);

      const packageId = createRes.body.data.id;
      expect(packageId).toBeDefined();

      await request(app)
        .delete(`/api/cms/packages/${packageId}`)
        .set(authHeaders())
        .expect(204);

      await request(app)
        .get(`/api/cms/packages/${packageId}`)
        .expect(404);
    });

    it('should return 404 for non-existent package', async () => {
      await request(app)
        .delete('/api/cms/packages/non-existent-id')
        .set(authHeaders())
        .expect(404);
    });
  });

  describe('Media resource saves (brochure/video/gallery)', () => {
    // Regression: a brochure uploaded through the admin form has NO description
    // field (the form uses subtitle) but the schema used to require it, so every
    // PDF save failed with 'description: Required'. Cloudinary metadata fields
    // were also stripped by zod, silently breaking Cloudinary delete-sync.
    const cloudinaryBrochure = {
      title: 'Luxury Collection 2026',
      subtitle: 'Official circuit guide',
      category: 'Luxury Tours',
      fileSize: '1.5 MB',
      totalPages: 0,
      coverImage: 'https://res.cloudinary.com/demo/image/upload/v1/cover.jpg',
      galleryImages: ['https://res.cloudinary.com/demo/image/upload/v1/cover.jpg'],
      pdfUrl: 'https://res.cloudinary.com/demo/raw/upload/v1/blht/brochures/guide.pdf',
      year: '2026',
      featured: true,
      tableOfContents: [{ page: 1, title: 'Welcome' }],
      pdf_public_id: 'blht/brochures/guide',
      pdf_resource_type: 'raw',
      pdf_format: 'pdf',
      pdf_bytes: 1500000,
      pdf_upload_date: '2026-08-07T06:03:14Z'
    };

    const cloudinaryVideo = {
      title: 'Paro Taktsang 4K',
      duration: '04:30',
      category: 'Documentary',
      description: 'Aerial documentary',
      videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/blht/videos/taktsang.mp4',
      thumbnailUrl: 'https://res.cloudinary.com/demo/video/upload/v1/blht/videos/taktsang.jpg',
      public_id: 'blht/videos/taktsang',
      resource_type: 'video',
      format: 'mp4',
      bytes: 1234567,
      upload_date: '2026-08-07T06:03:14Z'
    };

    it('should create a brochure without description (as the admin form sends)', async () => {
      const res = await request(app)
        .post('/api/cms/brochures')
        .set(authHeaders())
        .send(cloudinaryBrochure)
        .expect(201);

      expect(res.body.data.pdfUrl).toContain('guide.pdf');
    });

    it('should preserve Cloudinary metadata so delete-sync can find the asset', async () => {
      const res = await request(app)
        .post('/api/cms/brochures')
        .set(authHeaders())
        .send(cloudinaryBrochure)
        .expect(201);

      expect(res.body.data.pdf_public_id).toBe('blht/brochures/guide');
      expect(res.body.data.pdf_resource_type).toBe('raw');
      expect(res.body.data.pdf_bytes).toBe(1500000);
    });

    it('should preserve Cloudinary metadata for videos', async () => {
      const res = await request(app)
        .post('/api/cms/videos')
        .set(authHeaders())
        .send(cloudinaryVideo)
        .expect(201);

      expect(res.body.data.public_id).toBe('blht/videos/taktsang');
      expect(res.body.data.resource_type).toBe('video');
      expect(res.body.data.bytes).toBe(1234567);
    });

    it('should still reject an invalid pdfUrl', async () => {
      await request(app)
        .post('/api/cms/brochures')
        .set(authHeaders())
        .send({ ...cloudinaryBrochure, pdfUrl: 'not-a-url' })
        .expect(400);
    });
  });

  describe('Homepage Config', () => {
    it('should create homepage config', async () => {
      const res = await request(app)
        .post('/api/cms/homepage')
        .set(authHeaders())
        .send(validHomepage)
        .expect(201);

      expect(res.body.data).toHaveProperty('heroTitle', 'Welcome to the Land of Happiness');
      expect(res.body.data).toHaveProperty('id');
    });

    it('should update existing homepage config', async () => {
      const createRes = await request(app)
        .post('/api/cms/homepage')
        .set(authHeaders())
        .send(validHomepage);

      expect(createRes.status).toBe(201);
      const homepageId = createRes.body.data.id;
      expect(homepageId).toBeDefined();

      const updateRes = await request(app)
        .patch(`/api/cms/homepage/${homepageId}`)
        .set(authHeaders())
        .send({ heroTitle: 'Updated Hero Title' })
        .expect(200);

      expect(updateRes.body.data).toHaveProperty('heroTitle', 'Updated Hero Title');
    });
  });
});
