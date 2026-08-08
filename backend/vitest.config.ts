import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/__tests__/**',
        'src/app/server.ts',
        'src/core/config/logger.ts',
        'src/core/utils/seed.ts',
        'src/core/utils/seedData.ts',
        'src/shared/models/**',    // mongoose schema definitions
        'src/shared/types/**',     // type declarations only
        'src/core/errors/**',      // trivial error class
      ],
      // Fail CI if coverage regresses meaningfully.
      // Thresholds intentionally set near current measured values
      // (lines 53% / functions 37% / statements 52% / branches 45%) with
      // headroom; raise them as tests are added. Controllers for
      // cloudinary/upload/inquiry require heavy mocks - lightly covered.
      thresholds: {
        lines: 50,
        functions: 35,
        statements: 50,
        branches: 42,
      },
    },
  },
});
