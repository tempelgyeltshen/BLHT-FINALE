import type { Entity } from '../../../shared/types/entity.js';

export interface Brochure extends Entity {
  title: string;
  subtitle?: string;
  description?: string;
  category?: string;
  fileSize?: string;
  totalPages?: number;
  coverImage?: string;
  pdfUrl: string;
  downloadCount?: number;
  year?: string;
  featured?: boolean;
  galleryImages?: string[];
  tableOfContents?: { page: number; title: string }[];
  public_id?: string;
  pdf_public_id?: string;
}

export interface BrochureCreateRequest {
  title: string;
  subtitle?: string;
  description?: string;
  category?: string;
  fileSize?: string;
  totalPages?: number;
  coverImage?: string;
  pdfUrl: string;
  downloadCount?: number;
  year?: string;
  featured?: boolean;
  galleryImages?: string[];
  tableOfContents?: { page: number; title: string }[];
}

export interface BrochureUpdateRequest {
  title?: string;
  subtitle?: string;
  description?: string;
  category?: string;
  fileSize?: string;
  totalPages?: number;
  coverImage?: string;
  pdfUrl?: string;
  downloadCount?: number;
  year?: string;
  featured?: boolean;
  galleryImages?: string[];
  tableOfContents?: { page: number; title: string }[];
}
