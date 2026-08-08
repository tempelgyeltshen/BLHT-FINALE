import cors from 'cors';
import { env } from '../config/env.js';

export const corsMiddleware = cors({
  origin: env.frontendOrigin,
  credentials: true,
  // The frontend reads the CSRF token from this response header; without
  // exposing it, cross-origin JS (VITE_API_URL set) never sees the token
  // and every state-changing request fails with 403 Invalid CSRF token.
  exposedHeaders: ['x-csrf-token'],
});
