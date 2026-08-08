/**
 * API configuration for the frontend.
 * The base URL is resolved from Vite's env (VITE_API_URL) and defaults to the
 * same origin (the dev server proxies /api to the backend).
 */
export const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || '';

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  timeoutMs: 30000,
  withCredentials: true,
} as const;
