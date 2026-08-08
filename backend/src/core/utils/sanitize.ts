/**
 * Input sanitization utilities to prevent XSS attacks
 * This is a basic implementation - for production, consider using
 * a dedicated library like validator.js or DOMPurify
 */

/**
 * Sanitize string input by removing potentially dangerous content
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove common XSS patterns
  const xssPatterns = [
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=
    /data:/gi,
    /vbscript:/gi,
    /&lt;script/gi,
    /&gt;script/gi,
    /eval\(/gi,
    /expression\(/gi,
  ];

  xssPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Sanitize object by recursively sanitizing all string values
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeString(item) : 
        typeof item === 'object' && item !== null ? sanitizeObject(item as Record<string, unknown>) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

/**
 * Sanitize email address (basic validation)
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return '';
  }

  // Remove any potentially dangerous characters
  const sanitized = email.trim().toLowerCase();
  
  // Basic email validation pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailPattern.test(sanitized) ? sanitized : '';
}

/**
 * Sanitize phone number (keep only digits and common formatting characters)
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== 'string') {
    return '';
  }

  // Keep only digits, spaces, +, -, (, )
  return phone.replace(/[^\d\s\+\-\(\)]/g, '').trim();
}
