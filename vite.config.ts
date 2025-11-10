import { defineConfig } from 'vitest/config';
import solid from 'vite-plugin-solid';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'solid-js',
  },
  plugins: [solid()],
  test: {
    globals: true,
    environment: 'jsdom',
    server: {
      deps: {
        inline: [/solid-js/],
      },
    },
    include: ['tests/**/*.test.*'],
    coverage: {
      clean: true,
      reporter: ['text', 'html', 'lcov'],
      provider: 'v8',
      include: ['src'],
      exclude: ['src/index.tsx', 'src/vite-env.d.ts'],
    },
  },
});
