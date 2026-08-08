import { z } from 'zod';

export const galleryItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL'),
  caption: z.string().optional(),
  featured: z.boolean().optional(),

  // Cloudinary metadata for the uploaded image (preserved for delete-sync
  // and storage — without these the fields are stripped by zod).
  public_id: z.string().optional(),
  resource_type: z.enum(['image', 'video', 'raw']).optional(),
  format: z.string().optional(),
  bytes: z.number().optional(),
  upload_date: z.string().optional(),
});

export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
