export type HotelBrand = 'BLHT Sanctuary' | 'Six Senses' | 'COMO' | 'Pemako' | 'Zhiwa Ling' | 'Boutique';
export type HotelRegion = 'Paro' | 'Thimphu' | 'Punakha' | 'Gangtey' | 'Bumthang';

export interface Hotel {
  id: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface HotelFormData {
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
