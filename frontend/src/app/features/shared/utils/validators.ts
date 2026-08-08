/**
 * Lightweight validation helpers for forms and inputs.
 */

/** Basic email format check. */
export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

/** True when a string has non-whitespace content. */
export const isRequired = (value: string | undefined | null): boolean =>
  typeof value === 'string' && value.trim().length > 0;

/** Accepts common international phone formats (digits, +, spaces, dashes, parens). */
export const isValidPhone = (phone: string): boolean =>
  /^[+\d][\d\s\-().]{6,19}$/.test(phone.trim());

/** Basic http(s) URL check. */
export const isValidUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/** Validate an object of required string fields; returns the invalid keys. */
export const validateRequiredFields = (values: Record<string, string>): string[] =>
  Object.entries(values)
    .filter(([, value]) => !isRequired(value))
    .map(([key]) => key);
