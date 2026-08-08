export interface Package {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  durationDays: number;
  priceUSD: number;
  rating?: number;
  reviewsCount?: number;
  featured: boolean;
  heroImage: string;
  galleryImages?: string[];
  description: string;
  highlights?: string[];
  included?: string[];
  excluded?: string[];
  destinations?: string[];
  hotelCategory?: string;
  itinerary?: ItineraryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryItem {
  day: number;
  title: string;
  location: string;
  description: string;
  highlights?: string[];
}

export interface PackageFormData {
  title: string;
  subtitle?: string;
  category: string;
  durationDays: number;
  priceUSD: number;
  rating?: number;
  reviewsCount?: number;
  featured: boolean;
  heroImage: string;
  galleryImages?: string[];
  description: string;
  highlights?: string[];
  included?: string[];
  excluded?: string[];
  destinations?: string[];
  hotelCategory?: string;
  itinerary?: ItineraryItem[];
  createdAt?: string;
  updatedAt?: string;
}
