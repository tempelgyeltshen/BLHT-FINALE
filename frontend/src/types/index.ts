export type CategoryType = 'Cultural Tours' | 'Trekking Packages' | 'Adventure Tours' | 'cultural' | 'trekking' | 'adventure' | 'luxury' | 'festival' | 'wellness';
export type HotelCategory = '5-Star Luxury' | 'Boutique Lodge' | 'Heritage Suite' | 'Luxury Camp';
export type HotelBrand = 'BLHT Sanctuary' | 'Six Senses' | 'COMO' | 'Aman' | 'Pemako' | 'Zhiwa Ling' | 'Boutique';
export type Region = 'Paro' | 'Thimphu' | 'Punakha' | 'Gangtey' | 'Bumthang';
export type GalleryCategory = 'monasteries' | 'dzongs' | 'festivals' | 'luxury' | 'nature' | 'culture';
export type InquiryStatus = 'new' | 'contacted' | 'quoted' | 'booked' | 'archived';

// Re-export hotel types from the new feature location
export type { Hotel, HotelBrand as HotelBrandType, HotelRegion } from '../app/features/hotels/types/hotel.types';

export interface ItineraryDay {
  day: number;
  title: string;
  location: string;
  description: string;
  highlights: string[];
  accommodation?: string;
  meals?: string;
}

export interface TourPackage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: CategoryType;
  durationDays: number;
  priceUSD: number;
  rating: number;
  reviewsCount: number;
  featured: boolean;
  heroImage: string;
  galleryImages: string[];
  description: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  destinations: string[];
  hotelCategory: HotelCategory;
  itinerary: ItineraryDay[];
  brochureId?: string;
}

// Re-export feature types from their canonical feature locations
// (mirrors the Hotel re-export above).
export type { Festival, FestivalFormData } from '../app/features/festivals/types';
export type { Brochure, BrochureFormData, BrochureTableOfContentsEntry } from '../app/features/brochures/types';

export interface GalleryItem {
  id: string;
  title: string;
  location: string;
  category: GalleryCategory;
  imageUrl: string;
  caption: string;

  // Cloudinary metadata for the uploaded image (kept for delete-sync).
  public_id?: string;
  resource_type?: 'image' | 'video' | 'raw';
  format?: string;
  bytes?: number;
  upload_date?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  duration: string;
  youtubeId?: string;
  videoUrl?: string;
  thumbnailUrl: string;
  description: string;
  category: string;

  // Cloudinary metadata for the uploaded video (kept for delete-sync).
  public_id?: string;
  resource_type?: 'image' | 'video' | 'raw';
  format?: string;
  bytes?: number;
  upload_date?: string;
  thumbnail_public_id?: string;
  thumbnail_resource_type?: 'image' | 'video' | 'raw';
}

export interface ContactInquiry {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  travelDates?: string;
  durationDays?: number;
  groupSize?: number;
  interests: string[];
  estimatedBudgetPerPerson?: string;
  message: string;
  packageTitle?: string;
  status: InquiryStatus;
  adminNotes?: string;
}

export interface HomepageConfig {
  heroTitle: string;
  heroSubtitle: string;
  announcementText: string;
  announcementLink: string;
  heroVideoUrl: string;
  featuredPackagesCount: number;
  statsHeading: string;
  stats: { label: string; value: string; iconName: string }[];
}

export type ViewRoute = 
  | 'home'
  | 'about'
  | 'luxury'
  | 'package-detail'
  | 'adventures'
  | 'festivals'
  | 'hotels'
  | 'hotel-detail'
  | 'brochures'
  | 'brochure-viewer'
  | 'videos'
  | 'gallery'
  | 'showcase'
  | 'search'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'privacy-terms'
  | 'car-rental'
  | 'thangka-painting'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-packages'
  | 'admin-categories'
  | 'admin-brochures'
  | 'admin-brochure-viewer'
  | 'admin-hotels'
  | 'admin-festivals'
  | 'admin-videos'
  | 'admin-gallery'
  | 'admin-homepage'
  | 'admin-contacts';
