import { z } from 'zod';

export const packageSchema = z.object({
  slug: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  category: z.enum([
    'Cultural Tours', 'Trekking Packages', 'Adventure Tours',
    'cultural', 'trekking', 'adventure', 'luxury', 'festival', 'wellness'
  ], { errorMap: () => ({ message: 'Invalid category' }) }),
  durationDays: z.number().positive('Duration must be positive'),
  priceUSD: z.number().positive('Price must be positive'),
  rating: z.number().optional(),
  reviewsCount: z.number().optional(),
  featured: z.boolean().optional(),
  // Accept any string so data-URLs from local uploads and Cloudinary URLs both work.
  heroImage: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
  description: z.string().min(1, 'Description is required'),
  highlights: z.array(z.string()).optional(),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  destinations: z.array(z.string()).optional(),
  hotelCategory: z.string().optional(),
  itinerary: z.array(z.object({
    day: z.number(),
    title: z.string(),
    location: z.string(),
    description: z.string(),
    highlights: z.array(z.string()).optional(),
  })).optional(),
});

export type PackageInput = z.infer<typeof packageSchema>;
