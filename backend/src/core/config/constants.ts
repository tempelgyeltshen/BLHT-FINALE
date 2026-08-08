/**
 * Application-wide constants shared across the backend.
 * Single source of truth for collection names, rate limits, upload rules,
 * CSRF settings and search limits.
 */

/** MongoDB collections used by the generic Content-backed repositories. */
export const COLLECTIONS = {
  PACKAGES: 'packages',
  HOTELS: 'hotels',
  FESTIVALS: 'festivals',
  BROCHURES: 'brochures',
  GALLERY: 'gallery',
  VIDEOS: 'videos',
  HOMEPAGE: 'homepage',
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

/**
 * Collections included in global site search and dashboard stats.
 * Order matters: it defines the iteration order for stats/repositories.
 */
export const SEARCHABLE_COLLECTIONS: readonly CollectionName[] = [
  COLLECTIONS.PACKAGES,
  COLLECTIONS.HOTELS,
  COLLECTIONS.FESTIVALS,
  COLLECTIONS.BROCHURES,
  COLLECTIONS.GALLERY,
  COLLECTIONS.VIDEOS,
];

/** Maximum results returned per collection by the global search. */
export const SEARCH_LIMIT_PER_COLLECTION = 20;

/** Access token lifecycle. */
export const ACCESS_TOKEN = {
  /** JWT expiresIn string passed to jsonwebtoken. */
  ttl: '15m',
  /** Same value expressed in seconds (15 minutes = 900s). */
  ttlSeconds: 15 * 60,
} as const;

/** Rate limiting defaults applied by the express-rate-limit middleware. */
export const RATE_LIMIT = {
  /** Global API limiter (app-wide). Authenticated admin requests are skipped. */
  api: {
    windowMs: 15 * 60 * 1000,
    max: 200,
  },
  /** Login endpoint limiter. */
  login: {
    windowMs: 15 * 60 * 1000,
    max: 5,
  },
  /** Inquiry submission limiter. */
  inquiry: {
    windowMs: 60 * 60 * 1000,
    max: 5,
  },
} as const;

/** Multer upload rules. */
export const UPLOAD = {
  /** Maximum accepted file size (5GB). */
  maxFileSizeBytes: 5 * 1024 * 1024 * 1024,
  /** MIME types the file filter accepts. */
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
  ] as const,
  /** Folder used when the request does not specify one. */
  defaultFolder: 'misc',
  /** Cloudinary folder prefix used by the upload provider. */
  cloudinaryPrefix: 'blht',
} as const;

/** CSRF protection defaults. */
export const CSRF = {
  /** Token length in bytes (hex-encoded → 64 chars). */
  tokenLength: 32,
  /** Header name the frontend sends the token through. */
  headerName: 'x-csrf-token',
  /** Token validity window (1 hour). */
  ttlMs: 60 * 60 * 1000,
  /** Interval used to sweep expired tokens from the in-memory store. */
  sweepIntervalMs: 5 * 60 * 1000,
} as const;

/** Default TTL for cached service results (60s). */
export const CACHE_TTL_MS = 60_000;
