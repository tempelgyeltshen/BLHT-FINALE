import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Generic helper utilities used across the backend.
 */

/**
 * Convert any string into a URL-safe slug:
 * trims, lowercases, collapses non-alphanumerics to `-` and strips edge dashes.
 * Returns an empty string for input that contains no slugifiable characters.
 */
export const slugify = (input: string): string =>
  input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

/**
 * Wrap an async Express handler so thrown rejections are forwarded to the
 * error-handling middleware instead of crashing the process.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/** Parse a query-string boolean ("true"/"1"/true/1) into a real boolean. */
export const parseBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes'].includes(normalized)) return true;
    if (['false', '0', 'no'].includes(normalized)) return false;
  }
  return fallback;
};

/** Basic email format check (no RFC deep-parse). */
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

/** Clamp a number into a [min, max] range. */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** Paginate an in-memory array. Returns the slice plus page metadata. */
export const paginate = <T>(
  items: T[],
  page = 1,
  pageSize = 20,
): { items: T[]; page: number; pageSize: number; total: number; totalPages: number } => {
  const safePage = clamp(Math.trunc(page) || 1, 1, Number.MAX_SAFE_INTEGER);
  const safeSize = clamp(Math.trunc(pageSize) || 1, 1, 100);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / safeSize));
  const start = (safePage - 1) * safeSize;
  return {
    items: items.slice(start, start + safeSize),
    page: safePage,
    pageSize: safeSize,
    total,
    totalPages,
  };
};
