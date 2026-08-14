import type { Entity } from '../../../shared/types/entity.js';

export type HotelBrand = 'BLHT Sanctuary' | 'Six Senses' | 'COMO' | 'Aman' | 'Pemako' | 'Zhiwa Ling' | 'Boutique';
export type HotelRegion = 'Paro' | 'Thimphu' | 'Punakha' | 'Gangtey' | 'Bumthang';

export interface Hotel extends Entity {
  slug: string;
  name: string;
  brand: HotelBrand;
  location: string;
  region: HotelRegion;
  starRating: number;
  pricePerNightUSD: number;
  heroImage: string;
  images: string[];
  tagline: string;
  description: string;
  amenities: string[];
  featured: boolean;
}

export interface HotelCreateRequest {
  slug?: string;
  name: string;
  brand: HotelBrand;
  location: string;
  region: HotelRegion;
  starRating: number;
  pricePerNightUSD: number;
  heroImage: string;
  images?: string[];
  tagline: string;
  description: string;
  amenities: string[];
  featured: boolean;
}

export interface HotelUpdateRequest {
  slug?: string;
  name?: string;
  brand?: HotelBrand;
  location?: string;
  region?: HotelRegion;
  starRating?: number;
  pricePerNightUSD?: number;
  heroImage?: string;
  images?: string[];
  tagline?: string;
  description?: string;
  amenities?: string[];
  featured?: boolean;
}
