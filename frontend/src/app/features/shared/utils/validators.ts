/**
 * Lightweight validation helpers for forms and inputs.
 */

/** Basic email format check. */
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

/** True when a string has non-whitespace content. */
export const isRequired = (value: string | undefined | null): boolean =>
  typeof value === 'string' && value.trim().length > 0;
