import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

// Unit tests for the calculation engines and the report component (no browser needed).
export default defineConfig({
  test: {
    globals: true, // the existing test files use describe / it / expect without importing them
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
});
