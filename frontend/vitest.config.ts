import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',

      setupFiles: ['./src/test/setup.ts'],

      include: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/**/*.spec.ts',
        'src/**/*.spec.tsx',
      ],

      exclude: [
        'node_modules',
        'dist',
        'coverage',
      ],

      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        reportsDirectory: './coverage',

        exclude: [
          'node_modules/',
          'dist/',
          'coverage/',
          'src/test/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/main.tsx',
        ],
      },
    },
  }),
);