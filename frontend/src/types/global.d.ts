/**
 * Global ambient type declarations for the frontend.
 *
 * Vite's client types are pulled in via `vite-env.d.ts`; this file augments
 * the environment typing for our custom `VITE_*` variables and declares any
 * other app-wide globals.
 */

/// <reference types="@testing-library/jest-dom/vitest" />

interface ImportMetaEnv {
  /** Base URL of the backend API (optional — dev server proxies /api). */
  readonly VITE_API_URL?: string;
}
