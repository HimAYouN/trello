import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    testTimeout: 15000, // DB calls can be slow on first connection
    fileParallelism: false, // avoid multiple test files racing on the same DB
  },
});