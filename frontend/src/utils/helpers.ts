/**
 * Small, dependency-free helper functions shared across the app.
 */

/** Convert any string into a URL-safe slug. */
export const slugify = (input: string): string =>
  input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

/**
 * Validate that a value is a well-formed http(s) URL.
 * Returns true only for absolute URLs using the http: or https: protocol.
 */
export const isValidHttpUrl = (value: string): boolean => {
  if (!value || !value.trim()) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};
