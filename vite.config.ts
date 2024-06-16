/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.*'],
    coverage: {
      all: true,
      clean: true,
      reporter: ['text', 'html', 'lcov'],
      provider: 'v8',
      include: ['src'],
      exclude: ['src/index.tsx', 'src/vite-env.d.ts'],
    },
  },
});
