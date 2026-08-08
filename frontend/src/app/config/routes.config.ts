/**
 * Central route path constants used across the application.
 * These are the single source of truth for every URL the app navigates to.
 */
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  LUXURY: '/luxury',
  ADVENTURES: '/adventures',
  FESTIVALS: '/festivals',
  HOTELS: '/hotels',
  HOTEL_DETAIL: '/hotels/:slug',
  HOTEL_DETAIL_BY_ID: '/hotels/id/:id',
  PACKAGE_DETAIL: '/packages/:id',
  BROCHURES: '/brochures',
  BROCHURE_VIEWER: '/brochures/viewer',
  VIDEOS: '/videos',
  GALLERY: '/gallery',
  SHOWCASE: '/showcase',
  SEARCH: '/search',
  CONTACT: '/contact',
  PRIVACY_TERMS: '/privacy-terms',

  // Admin
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PACKAGES: '/admin/packages',
  ADMIN_BROCHURES: '/admin/brochures',
  ADMIN_BROCHURE_VIEWER: '/admin/brochure-viewer',
  ADMIN_HOTELS: '/admin/hotels',
  ADMIN_FESTIVALS: '/admin/festivals',
  ADMIN_VIDEOS: '/admin/videos',
  ADMIN_GALLERY: '/admin/gallery',
  ADMIN_HOMEPAGE: '/admin/homepage',
  ADMIN_CONTACTS: '/admin/contacts',
} as const;

/** Build a package detail URL for a package id/slug. */
export const packageDetailPath = (idOrSlug: string) => `/packages/${idOrSlug}`;

/** Build a hotel detail URL for a hotel slug or id. */
export const hotelDetailPath = (slugOrId: string) => `/hotels/${slugOrId}`;
