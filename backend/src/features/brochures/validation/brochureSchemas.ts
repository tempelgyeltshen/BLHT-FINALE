import { z } from 'zod';

export const brochureSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  // Accept absolute http(s) links and same-origin /api paths (MongoDB
  // GridFS-hosted PDFs are streamed through the backend at /api/uploads/mongo/...).
  // Restricted to /api/ so protocol-relative URLs (//host) can never slip in.
  pdfUrl: z.string().refine(
    (url) => url.startsWith('/api/') || /^https?:\/\//i.test(url),
    'Invalid PDF URL'
  ),
  coverImage: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
  fileSize: z.string().optional(),
  totalPages: z.number().optional(),
  year: z.string().optional(),
  featured: z.boolean().optional(),
  downloadCount: z.number().optional(),
  tableOfContents: z.array(z.object({
    page: z.number(),
    title: z.string(),
  })).optional(),

  // Cloudinary metadata for the uploaded PDF (preserved for delete-sync
  // and storage — without these the fields are stripped by zod).
  pdf_public_id: z.string().optional(),
  pdf_resource_type: z.enum(['image', 'video', 'raw']).optional(),
  pdf_format: z.string().optional(),
  pdf_bytes: z.number().optional(),
  pdf_upload_date: z.string().optional(),

  // MongoDB GridFS metadata for PDFs too large for Cloudinary's raw limit
  // (preserved for delete-sync — without these the fields are stripped).
  pdf_storage: z.enum(['cloudinary', 'mongo']).optional(),
  pdf_file_id: z.string().optional(),
});

export type BrochureInput = z.infer<typeof brochureSchema>;
