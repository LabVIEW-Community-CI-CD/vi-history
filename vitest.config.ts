// VI History - MIT License
// Vitest configuration

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/out/**', '**/.vi-history-suite/**'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'out/**']
    },
    testTimeout: 30000,
    hookTimeout: 30000
  }
});
