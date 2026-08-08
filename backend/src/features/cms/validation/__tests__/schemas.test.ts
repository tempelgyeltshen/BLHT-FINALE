import { describe, it, expect } from 'vitest';
import { packageSchema } from '../../../packages/validation/packageSchemas.js';
import { hotelSchema } from '../../../hotels/validation/hotelSchemas.js';
import { festivalSchema } from '../../../festivals/validation/festivalSchemas.js';
import { brochureSchema } from '../../../brochures/validation/brochureSchemas.js';
import { galleryItemSchema } from '../../../gallery/validation/gallerySchemas.js';
import { videoItemSchema } from '../../../videos/validation/videoSchemas.js';
import { homepageConfigSchema } from '../../../homepage/validation/homepageSchemas.js';
import { loginSchema } from '../../../auth/validation/authSchemas.js';
import { inquirySchema } from '../../../inquiries/validation/inquirySchemas.js';

const validPackage = {
  slug: 'test-package',
  title: 'Test Package Title',
  subtitle: 'A test subtitle',
  category: 'Cultural Tours',
  durationDays: 7,
  priceUSD: 5000,
  rating: 4.5,
  reviewsCount: 10,
  featured: true,
  heroImage: 'https://example.com/image.jpg',
  galleryImages: ['https://example.com/img1.jpg'],
  description: 'A detailed description of the test package that is long enough.',
  highlights: ['Highlight one'],
  included: ['Included item'],
  excluded: ['Excluded item'],
  destinations: ['Paro'],
  hotelCategory: '5-Star Luxury',
  itinerary: [{
    day: 1,
    title: 'Day One Title',
    location: 'Paro',
    description: 'Description of day one activity that is reasonably long.',
    highlights: ['Activity']
  }]
};

const validHotel = {
  slug: 'test-hotel',
  name: 'Test Hotel',
  brand: 'BLHT Sanctuary',
  location: 'Paro Valley',
  region: 'Paro',
  starRating: 5,
  pricePerNightUSD: 2000,
  heroImage: 'https://example.com/hotel.jpg',
  images: ['https://example.com/img1.jpg'],
  tagline: 'A luxury test hotel tagline.',
  description: 'A detailed description of the hotel that meets minimum length.',
  amenities: ['Spa', 'Pool'],
  featured: true
};

const validFestival = {
  slug: 'test-festival',
  name: 'Test Festival',
  location: 'Paro',
  dzong: 'Paro Dzong',
  dates2027: 'March 18-22, 2027',
  month: 'March',
  description: 'A description of the festival event that is detailed enough.',
  significance: 'The spiritual significance of this sacred event.',
  heroImage: 'https://example.com/fest.jpg',
  durationDays: 3,
  featured: false
};

const validHomepage = {
  heroTitle: 'Experience Bhutan in Luxury',
  heroSubtitle: 'A detailed subtitle for the hero section that is long enough.',
  announcementText: 'Special announcement text here.',
  announcementLink: '/festivals',
  heroVideoUrl: 'https://example.com/video.mp4',
  featuredPackagesCount: 3,
  statsHeading: 'Why Choose Us',
  stats: [{ label: 'Guides', value: '100%', iconName: 'Award' }]
};

describe('validation schemas', () => {
  describe('packageSchema', () => {
    it('should accept valid package data', () => {
      expect(() => packageSchema.parse(validPackage)).not.toThrow();
    });

    it('should accept package without slug (auto-generated)', () => {
      const { slug, ...noSlug } = validPackage;
      expect(() => packageSchema.parse(noSlug)).not.toThrow();
    });

    it('should accept Cultural Tours category', () => {
      expect(() => packageSchema.parse({ ...validPackage, category: 'Cultural Tours' })).not.toThrow();
    });

    it('should accept Trekking Packages category', () => {
      expect(() => packageSchema.parse({ ...validPackage, category: 'Trekking Packages' })).not.toThrow();
    });

    it('should reject invalid category', () => {
      expect(() => packageSchema.parse({ ...validPackage, category: 'Invalid' })).toThrow();
    });

    it('should reject missing required fields', () => {
      const { title, ...noTitle } = validPackage;
      expect(() => packageSchema.parse(noTitle)).toThrow();
    });
  });

  describe('hotelSchema', () => {
    it('should accept valid hotel data', () => {
      expect(() => hotelSchema.parse(validHotel)).not.toThrow();
    });

    it('should accept hotel without slug', () => {
      const { slug, ...noSlug } = validHotel;
      expect(() => hotelSchema.parse(noSlug)).not.toThrow();
    });

    it('should accept empty images array', () => {
      expect(() => hotelSchema.parse({ ...validHotel, images: [] })).not.toThrow();
    });

    it('should accept any brand string', () => {
      expect(() => hotelSchema.parse({ ...validHotel, brand: 'Custom Brand' })).not.toThrow();
    });

    it('should reject invalid region', () => {
      expect(() => hotelSchema.parse({ ...validHotel, region: 'Invalid' })).toThrow();
    });
  });

  describe('festivalSchema', () => {
    it('should accept valid festival data', () => {
      expect(() => festivalSchema.parse(validFestival)).not.toThrow();
    });

    it('should accept festival with short description', () => {
      expect(() => festivalSchema.parse({ ...validFestival, description: 'Short' })).not.toThrow();
    });

    it('should accept festival with short significance', () => {
      expect(() => festivalSchema.parse({ ...validFestival, significance: 'Short' })).not.toThrow();
    });

    it('should accept festival with slNo', () => {
      expect(() => festivalSchema.parse({ ...validFestival, slNo: 1 })).not.toThrow();
    });

    it('should reject missing required fields', () => {
      const { name, ...noName } = validFestival;
      expect(() => festivalSchema.parse(noName)).toThrow();
    });
  });

  describe('homepageConfigSchema', () => {
    it('should accept valid homepage config', () => {
      expect(() => homepageConfigSchema.parse(validHomepage)).not.toThrow();
    });

    it('should accept relative announcementLink', () => {
      expect(() => homepageConfigSchema.parse({ ...validHomepage, announcementLink: '/festivals' })).not.toThrow();
    });

    it('should accept URL announcementLink', () => {
      expect(() => homepageConfigSchema.parse({ ...validHomepage, announcementLink: 'https://example.com' })).not.toThrow();
    });

    it('should accept optional announcementLink', () => {
      const { announcementLink, ...noLink } = validHomepage;
      expect(() => homepageConfigSchema.parse(noLink)).not.toThrow();
    });

    it('should reject empty stats array', () => {
      expect(() => homepageConfigSchema.parse({ ...validHomepage, stats: [] })).toThrow();
    });
  });

  describe('brochureSchema', () => {
    const validBrochure = {
      title: 'Luxury Collection 2026',
      subtitle: 'Official circuit guide',
      category: 'Luxury Tours',
      pdfUrl: 'https://res.cloudinary.com/demo/raw/upload/v1/blht/brochures/guide.pdf',
      coverImage: 'https://example.com/cover.jpg',
      fileSize: '1.5 MB',
      totalPages: 24,
      year: '2026',
      featured: true,
      tableOfContents: [{ page: 1, title: 'Welcome' }]
    };

    it('should accept a brochure without description (admin form does not send it)', () => {
      expect(() => brochureSchema.parse(validBrochure)).not.toThrow();
    });

    it('should preserve Cloudinary pdf_* metadata fields', () => {
      const parsed = brochureSchema.parse({
        ...validBrochure,
        pdf_public_id: 'blht/brochures/guide',
        pdf_resource_type: 'raw',
        pdf_format: 'pdf',
        pdf_bytes: 1500000,
        pdf_upload_date: '2026-08-07T06:03:14Z'
      });
      expect(parsed.pdf_public_id).toBe('blht/brochures/guide');
      expect(parsed.pdf_resource_type).toBe('raw');
      expect(parsed.pdf_bytes).toBe(1500000);
    });

    it('should reject invalid pdfUrl', () => {
      expect(() => brochureSchema.parse({ ...validBrochure, pdfUrl: 'not-a-url' })).toThrow();
    });
  });

  describe('videoItemSchema', () => {
    const validVideo = {
      title: 'Paro Taktsang 4K',
      duration: '04:30',
      category: 'Documentary',
      description: 'Aerial tour',
      thumbnailUrl: 'https://res.cloudinary.com/demo/video/upload/v1/blht/videos/x.jpg'
    };

    it('should preserve Cloudinary metadata fields', () => {
      const parsed = videoItemSchema.parse({
        ...validVideo,
        videoUrl: 'https://res.cloudinary.com/demo/video/upload/v1/blht/videos/x.mp4',
        public_id: 'blht/videos/x',
        resource_type: 'video',
        format: 'mp4',
        bytes: 1234567,
        upload_date: '2026-08-07T06:03:14Z',
        thumbnail_public_id: 'blht/videos/x',
        thumbnail_resource_type: 'image'
      });
      expect(parsed.public_id).toBe('blht/videos/x');
      expect(parsed.resource_type).toBe('video');
      expect(parsed.bytes).toBe(1234567);
      expect(parsed.thumbnail_public_id).toBe('blht/videos/x');
    });
  });

  describe('galleryItemSchema', () => {
    it('should preserve Cloudinary metadata fields', () => {
      const parsed = galleryItemSchema.parse({
        title: 'Paro Dzong',
        location: 'Paro',
        category: 'dzongs',
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/blht/gallery/x.jpg',
        public_id: 'blht/gallery/x',
        resource_type: 'image',
        format: 'jpg',
        bytes: 204800,
        upload_date: '2026-08-07T06:03:14Z'
      });
      expect(parsed.public_id).toBe('blht/gallery/x');
      expect(parsed.bytes).toBe(204800);
    });
  });

  describe('loginSchema', () => {
    it('should accept valid login', () => {
      expect(() => loginSchema.parse({ email: 'admin@test.com', password: 'password123' })).not.toThrow();
    });

    it('should reject short password', () => {
      expect(() => loginSchema.parse({ email: 'admin@test.com', password: 'short' })).toThrow();
    });

    it('should reject invalid email', () => {
      expect(() => loginSchema.parse({ email: 'not-an-email', password: 'password123' })).toThrow();
    });
  });

  describe('inquirySchema', () => {
    it('should accept valid inquiry', () => {
      expect(() => inquirySchema.parse({
        fullName: 'John Doe',
        email: 'john@example.com',
        country: 'USA',
        durationDays: 7,
        groupSize: 2,
        interests: ['Luxury'],
        message: 'I would like to plan a trip to Bhutan with my family.'
      })).not.toThrow();
    });

    it('should reject missing required fields', () => {
      expect(() => inquirySchema.parse({ fullName: 'John' })).toThrow();
    });
  });
});
