import type { Entity } from '../../../shared/types/entity.js';

export type GalleryCategory = 'monasteries' | 'dzongs' | 'festivals' | 'luxury' | 'nature' | 'culture';

export interface GalleryItem extends Entity {
  title: string;
  description?: string;
  location?: string;
  category?: GalleryCategory | string;
  imageUrl: string;
  caption?: string;
  featured?: boolean;
}

export interface GalleryItemCreateRequest {
  title: string;
  description?: string;
  location?: string;
  category?: GalleryCategory | string;
  imageUrl: string;
  caption?: string;
  featured?: boolean;
}

export interface GalleryItemUpdateRequest {
  title?: string;
  description?: string;
  location?: string;
  category?: GalleryCategory | string;
  imageUrl?: string;
  caption?: string;
  featured?: boolean;
}
