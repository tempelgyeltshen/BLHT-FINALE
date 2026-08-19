/**
 * API configuration for the frontend.
 * The base URL is resolved from Vite's env (VITE_API_URL) and defaults to the
 * same origin (the dev server proxies /api to the backend).
 *
 * A deployed app must never point at the visitor's own machine. If a
 * localhost/loopback URL was baked into the build (e.g. from a local .env or
 * a mis-set Vercel env var), we fall back to same-origin /api, which the
 * Vercel rewrite / nginx proxy forwards to the backend.
 */
const rawBaseUrl = (import.meta.env.VITE_API_URL as string | undefined) || '';

const isLoopback = /^(https?:\/\/)?(localhost|127\.0\.0\.1|\[::1\])(:\d+)?([/?#]|$)/i.test(rawBaseUrl);

export const API_BASE_URL = isLoopback ? '' : rawBaseUrl;
