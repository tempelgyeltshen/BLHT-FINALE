/**
 * API interceptors: auth token + CSRF header injection and 401 handling.
 * Extracted from the fetch client so the logic is testable and reusable.
 */

export const TOKEN_KEY = 'blht_access_token';

export const getAccessToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const setAccessToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/** Attach the Bearer token when present. */
export const attachAuthHeader = (headers: Headers): void => {
  const token = getAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
};

/** Attach the CSRF token for state-changing methods. */
export const attachCsrfHeader = (headers: Headers, method: string, csrfToken: string | null): void => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase()) && csrfToken) {
    headers.set('x-csrf-token', csrfToken);
  }
};

/** Read a CSRF token emitted by the backend response header. */
export const extractCsrfToken = (response: Response): string | null =>
  response.headers.get('x-csrf-token');

/** True when the response indicates the session is invalid (401). */
export const isUnauthorized = (response: Response): boolean => response.status === 401;

/**
 * Handle a 401: clear the session and, when on an admin page (not the login
 * page), bounce to the admin login. Returns true when a redirect happened.
 */
export const handleUnauthorized = (pathname: string): boolean => {
  setAccessToken(null);
  if (pathname.startsWith('/admin') && !pathname.includes('/admin/login')) {
    window.location.href = '/admin/login';
    return true;
  }
  return false;
};
