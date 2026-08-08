import { z } from 'zod';

export const homepageConfigSchema = z.object({
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  announcementText: z.string().optional(),
  announcementLink: z.string().optional(),
  heroImage: z.string().optional(),
  heroVideoUrl: z.string().optional(),
  featuredPackagesCount: z.number().optional(),
  statsHeading: z.string().optional(),
  stats: z.array(z.object({
    label: z.string(),
    value: z.string(),
    iconName: z.string(),
  })).min(1, 'At least one stat is required').optional(),
  featuredPackages: z.array(z.string()).optional(),
  featuredHotels: z.array(z.string()).optional(),
  featuredFestivals: z.array(z.string()).optional(),
  featuredGallery: z.array(z.string()).optional(),
  ceoSection: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
  }).optional(),
});

export type HomepageConfigInput = z.infer<typeof homepageConfigSchema>;
