import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { sharedVitestConfig } from './src/lib/config/vitest.config';

export default defineConfig({
  plugins: [react()],
  test: {
    ...sharedVitestConfig.test,
  },
});
