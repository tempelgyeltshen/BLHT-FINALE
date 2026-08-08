/**
 * Shared Vitest base configuration.
 * Imported by the root `vitest.config.ts` so tooling options live in one place.
 */
export const sharedVitestConfig = {
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8' as const,
      reporter: ['text', 'json', 'lcov'],
      include: [
        'src/lib/services/cloudinary.service.ts',
        'src/app/features/shared/hooks/useCloudinaryUpload.ts',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        statements: 70,
        branches: 50,
      },
    },
  },
};
