import { z } from 'zod';

export const hotelSchema = z.object({
  slug: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  brand: z.string().min(1, 'Brand is required'),
  location: z.string().min(1, 'Location is required'),
  region: z.enum(['Paro', 'Thimphu', 'Punakha', 'Gangtey', 'Bumthang'], {
    errorMap: () => ({ message: 'Invalid region' })
  }),
  starRating: z.number().min(1).max(5),
  pricePerNightUSD: z.number().positive('Price must be positive'),
  heroImage: z.string().url('Hero image must be a valid URL'),
  images: z.array(z.string().url('Image must be a valid URL')).optional(),
  tagline: z.string().min(1, 'Tagline is required'),
  description: z.string().min(1, 'Description is required'),
  amenities: z.array(z.string()).min(1, 'At least one amenity is required'),
  featured: z.boolean(),
});

export type HotelInput = z.infer<typeof hotelSchema>;
