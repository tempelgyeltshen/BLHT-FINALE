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
  accommodation?: string;
  meals?: string;
}

export interface PackageCreateRequest {
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
}

export interface PackageUpdateRequest {
  title?: string;
  subtitle?: string;
  category?: string;
  durationDays?: number;
  priceUSD?: number;
  rating?: number;
  reviewsCount?: number;
  featured?: boolean;
  heroImage?: string;
  galleryImages?: string[];
  description?: string;
  highlights?: string[];
  included?: string[];
  excluded?: string[];
  destinations?: string[];
  hotelCategory?: string;
  itinerary?: ItineraryItem[];
}
