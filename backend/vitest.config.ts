import { defineConfig } from 'vitest/config';
import path from 'path';
import dotenv from 'dotenv';


dotenv.config({ 
    path: path.resolve(__dirname, '.env.test'),
    override: true
});

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@domain': path.resolve(__dirname, 'domain'),
      '@application': path.resolve(__dirname, 'application'),
      '@infrastructure': path.resolve(__dirname, 'infrastructure'),
      '@presentation': path.resolve(__dirname, 'presentation'),
    },
  },

  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/helpers/setup.ts'],

    include: [
      'tests/**/*.test.ts',
      'tests/**/*.spec.ts',
    ],

    exclude: [
      'node_modules',
      'dist',
      'coverage',
    ],

    fileParallelism: false,  // отсуствие паралелизма для Node.js
    maxWorkers: 1,

    testTimeout: 30_000,

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',

      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
        '**/server.ts',
        '**/prisma/**',
      ],
    },
  },
});