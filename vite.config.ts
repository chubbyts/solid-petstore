import { defineConfig } from 'vitest/config';
import solid from 'vite-plugin-solid';

export default defineConfig(({ mode }) => ({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'solid-js',
  },
  plugins: [
    solid({ hot: mode !== 'test' }),
    {
      // vitest passes the ssr conditions to node, the browser condition breaks node only packages like nock
      name: 'remove-ssr-browser-condition',
      enforce: 'post',
      configEnvironment: (name, config) => {
        if (name === 'ssr' && config.resolve?.conditions) {
          config.resolve.conditions = config.resolve.conditions.filter((condition) => condition !== 'browser');
        }
      },
    },
  ],
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
}));
