import { z } from 'zod';

export const videoItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  duration: z.string().optional(),
  youtubeId: z.string().optional(),
  videoUrl: z.string().url('Invalid video URL').optional(),
  thumbnailUrl: z.string().optional(),
  category: z.string().optional(),
  featured: z.boolean().optional(),

  // Cloudinary metadata for the uploaded video and its thumbnail
  // (preserved for delete-sync and storage — without these the fields
  // are stripped by zod).
  public_id: z.string().optional(),
  resource_type: z.enum(['image', 'video', 'raw']).optional(),
  format: z.string().optional(),
  bytes: z.number().optional(),
  upload_date: z.string().optional(),
  thumbnail_public_id: z.string().optional(),
  thumbnail_resource_type: z.enum(['image', 'video', 'raw']).optional(),
});

export type VideoItemInput = z.infer<typeof videoItemSchema>;
