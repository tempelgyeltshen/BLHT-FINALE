/**
 * Brochure domain types for the brochure viewer & admin brochure management.
 * `Brochure` matches the app-wide data shape (see src/types).
 */

export interface BrochureTableOfContentsEntry {
  page: number;
  title: string;
}

export interface Brochure {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  fileSize: string;
  totalPages: number;
  coverImage: string;
  pdfUrl: string;
  downloadCount: number;
  year: string;
  featured: boolean;
  galleryImages?: string[];
  tableOfContents?: BrochureTableOfContentsEntry[];

  // Cloudinary metadata for the uploaded PDF (kept for delete-sync).
  pdf_public_id?: string;
  pdf_resource_type?: 'image' | 'video' | 'raw';
  pdf_format?: string;
  pdf_bytes?: number;
  pdf_upload_date?: string;

  // MongoDB GridFS metadata for PDFs too large for Cloudinary's raw limit.
  pdf_storage?: 'cloudinary' | 'mongo';
  pdf_file_id?: string;
}

/** Payload used when creating/updating a brochure (id/downloadCount derived). */
export type BrochureFormData = Omit<Brochure, 'id' | 'downloadCount'>;
