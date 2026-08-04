import { z } from 'zod';

// Email validation
const emailSchema = z.string().email('Invalid email address').trim().toLowerCase();

// Phone validation (international format)
const phoneSchema = z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number').optional();

// Name validation
const nameSchema = z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long').trim();

// URL validation
const urlSchema = z.string().url('Invalid URL').optional();

// UUID validation
const uuidSchema = z.string().uuid('Invalid ID format');

// Inquiry validation schema
export const inquirySchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  country: z.string().min(2, 'Country is required').max(100, 'Country name is too long').trim(),
  travelDates: z.string().optional(),
  durationDays: z.number().int().positive('Duration must be positive').max(30, 'Maximum 30 days'),
  groupSize: z.number().int().positive('Group size must be positive').max(50, 'Maximum 50 people'),
  interests: z.array(z.string().min(1)).min(1, 'At least one interest is required').max(10, 'Maximum 10 interests'),
  estimatedBudgetPerPerson: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long').trim()
});

// Admin login validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password is too long')
});

// Resource ID validation
export const resourceIdSchema = z.object({
  id: uuidSchema
});

// Package validation schema
export const packageSchema = z.object({
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  title: z.string().min(5).max(200).trim(),
  subtitle: z.string().min(5).max(300).trim(),
  category: z.enum(['luxury', 'adventure', 'festival', 'cultural', 'wellness']),
  durationDays: z.number().int().positive().max(30),
  priceUSD: z.number().positive('Price must be positive'),
  rating: z.number().min(0).max(5),
  reviewsCount: z.number().int().min(0),
  featured: z.boolean(),
  heroImage: urlSchema,
  galleryImages: z.array(urlSchema).min(1).max(20),
  description: z.string().min(50).max(5000).trim(),
  highlights: z.array(z.string().min(5).max(200)).min(1).max(10),
  included: z.array(z.string().min(5).max(200)).min(1).max(15),
  excluded: z.array(z.string().min(5).max(200)).max(15),
  destinations: z.array(z.string().min(2).max(50)).min(1).max(10),
  hotelCategory: z.enum(['5-Star Luxury', 'Boutique Lodge', 'Heritage Suite', 'Luxury Camp']),
  itinerary: z.array(z.object({
    day: z.number().int().positive(),
    title: z.string().min(5).max(200).trim(),
    location: z.string().min(2).max(100).trim(),
    description: z.string().min(20).max(1000).trim(),
    highlights: z.array(z.string().min(5).max(200)).max(5),
    accommodation: z.string().min(2).max(200).optional(),
    meals: z.string().min(2).max(200).optional()
  })).min(1).max(15)
});

// Hotel validation schema
export const hotelSchema = z.object({
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  name: z.string().min(3).max(200).trim(),
  brand: z.enum(['BLHT Sanctuary', 'Six Senses', 'COMO', 'Pemako', 'Zhiwa Ling', 'Boutique']),
  location: z.string().min(2).max(100).trim(),
  region: z.enum(['Paro', 'Thimphu', 'Punakha', 'Gangtey', 'Bumthang']),
  starRating: z.number().int().min(1).max(5),
  pricePerNightUSD: z.number().positive('Price must be positive'),
  heroImage: urlSchema,
  images: z.array(urlSchema).min(1).max(20),
  tagline: z.string().min(5).max(200).trim(),
  description: z.string().min(50).max(3000).trim(),
  amenities: z.array(z.string().min(2).max(50)).min(1).max(20),
  featured: z.boolean()
});

// Festival validation schema
export const festivalSchema = z.object({
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  name: z.string().min(3).max(200).trim(),
  location: z.string().min(2).max(100).trim(),
  dzong: z.string().min(2).max(100).trim(),
  dates2026: z.string().optional(),
  dates2027: z.string().min(5).max(100),
  month: z.string().min(3).max(20),
  description: z.string().min(50).max(2000).trim(),
  significance: z.string().min(20).max(1000).trim(),
  heroImage: urlSchema,
  durationDays: z.number().int().positive().max(10),
  featured: z.boolean()
});

// Brochure validation schema
export const brochureSchema = z.object({
  title: z.string().min(5).max(200).trim(),
  subtitle: z.string().min(5).max(300).trim(),
  category: z.string().min(2).max(50).trim(),
  fileSize: z.string().optional(), // Auto-calculated from upload
  totalPages: z.number().int().positive().max(500).optional(), // Auto-calculated from PDF
  coverImage: urlSchema,
  pdfUrl: urlSchema,
  downloadCount: z.number().int().min(0).default(0),
  year: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number'),
  featured: z.boolean(),
  galleryImages: z.array(urlSchema).max(20).optional(),
  tableOfContents: z.array(z.object({
    page: z.number().int().positive(),
    title: z.string().min(2).max(200).trim()
  })).max(50).optional()
});

// Gallery item validation schema
export const galleryItemSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  location: z.string().min(2).max(100).trim(),
  category: z.enum(['monasteries', 'dzongs', 'festivals', 'luxury', 'nature', 'culture']),
  imageUrl: urlSchema,
  caption: z.string().min(10).max(500).trim()
});

// Video item validation schema
export const videoItemSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  duration: z.string().optional(), // Auto-calculated from YouTube API
  youtubeId: z.string().min(11).max(11).regex(/^[a-zA-Z0-9_-]+$/, 'Invalid YouTube ID'),
  thumbnailUrl: urlSchema.optional(), // Auto-generated from YouTube if not provided
  description: z.string().min(20).max(1000).trim(),
  category: z.string().min(2).max(50).trim()
});

// Homepage config validation schema
export const homepageConfigSchema = z.object({
  heroTitle: z.string().min(5).max(200).trim(),
  heroSubtitle: z.string().min(10).max(500).trim(),
  announcementText: z.string().min(5).max(300).trim(),
  announcementLink: urlSchema,
  heroVideoUrl: urlSchema,
  featuredPackagesCount: z.number().int().min(1).max(10),
  statsHeading: z.string().min(3).max(100).trim(),
  stats: z.array(z.object({
    label: z.string().min(2).max(50).trim(),
    value: z.string().min(1).max(50),
    iconName: z.string().min(2).max(50)
  })).min(1).max(6)
});