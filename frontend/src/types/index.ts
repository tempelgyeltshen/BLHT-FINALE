export type CategoryType = 'Cultural Tours' | 'Trekking Packages' | 'Adventure Tours' | 'cultural' | 'trekking' | 'adventure' | 'luxury' | 'festival' | 'wellness';
export type HotelCategory = '5-Star Luxury' | 'Boutique Lodge' | 'Heritage Suite' | 'Luxury Camp';
export type HotelBrand = 'BLHT Sanctuary' | 'Six Senses' | 'COMO' | 'Pemako' | 'Zhiwa Ling' | 'Boutique';
export type Region = 'Paro' | 'Thimphu' | 'Punakha' | 'Gangtey' | 'Bumthang';
export type GalleryCategory = 'monasteries' | 'dzongs' | 'festivals' | 'luxury' | 'nature' | 'culture';
export type InquiryStatus = 'new' | 'contacted' | 'quoted' | 'booked' | 'archived';

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

export interface Hotel {
  id: string;
  slug: string;
  name: string;
  brand: HotelBrand;
  location: string;
  region: Region;
  starRating: number;
  pricePerNightUSD: number;
  heroImage: string;
  images: string[];
  tagline: string;
  description: string;
  amenities: string[];
  featured: boolean;
}

export interface Festival {
  id: string;
  slug: string;
  name: string;
  location: string;
  dzong: string;
  dates2026?: string;
  dates2027: string;
  month: string;
  description: string;
  significance: string;
  heroImage: string;
  durationDays: number;
  featured: boolean;
  slNo?: number;
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
  tableOfContents: { page: number; title: string }[];
}

export interface GalleryItem {
  id: string;
  title: string;
  location: string;
  category: GalleryCategory;
  imageUrl: string;
  caption: string;
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
