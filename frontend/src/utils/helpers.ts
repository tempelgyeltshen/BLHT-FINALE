/**
 * Small, dependency-free helper functions shared across the app.
 */

/** Join truthy class names into a single className string. */
export const cn = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

/** Convert any string into a URL-safe slug. */
export const slugify = (input: string): string =>
  input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

/** Truncate a string to `max` characters, appending an ellipsis when cut. */
export const truncate = (text: string, max: number): string => {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
};

/** Clamp a number into a [min, max] range. */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** Generate a short unique id (not crypto-strength; for UI keys only). */
export const uid = (prefix = 'id'): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** Capitalize the first letter of a string. */
export const capitalize = (input: string): string =>
  input.length === 0 ? input : input.charAt(0).toUpperCase() + input.slice(1);

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
