import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Identicon',
      fileName: 'index',
      formats: ['es'],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
