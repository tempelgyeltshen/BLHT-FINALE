import { z } from 'zod';

export const festivalSchema = z.object({
  slug: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
  dzong: z.string().optional(),
  dates2026: z.string().optional(),
  dates2027: z.string().optional(),
  month: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  significance: z.string().optional(),
  heroImage: z.string().optional(),
  durationDays: z.number().optional(),
  featured: z.boolean().optional(),
  slNo: z.number().optional(),
});

export type FestivalInput = z.infer<typeof festivalSchema>;
