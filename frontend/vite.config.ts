import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
  test: {
    // Глобальные переменные окружения для тестов
    env: {
      NODE_ENV: 'test',
    },
 
    // Загружаем .env.test перед тестами
    // Установи: npm i -D dotenv
    setupFiles: ['dotenv/config'],
 
    // Последовательное выполнение интеграционных и e2e тестов
    // (они делят тестовую БД — параллельность сломает изоляцию)
    pool: 'forks',
    poolOptions: {
      forks: {
        // Интеграционные и e2e — строго последовательно
        singleFork: true,
      },
    },
    // Таймаут для e2e тестов (реальные HTTP + БД медленнее)
    testTimeout: 30_000,
 
    // Алиасы путей (должны совпадать с tsconfig.paths)
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@features': path.resolve(__dirname, './src/features'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
    },
  },
  plugins: [
    react(), 
    visualizer({
filename: 'dist/stats.html',
open: true,
gzipSize: true,
}),],

  resolve: {
    alias: {
      '@app':      path.resolve(__dirname, 'src/app'),
      '@pages':    path.resolve(__dirname, 'src/pages'),
      '@widgets':  path.resolve(__dirname, 'src/widgets'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@entities': path.resolve(__dirname, 'src/entities'),
      '@shared':   path.resolve(__dirname, 'src/shared'),
    },
  },

  server: {
    port: 3000,
    proxy: {
      // Все запросы /api/* → бэкенд на 7898
      // Это убирает необходимость в CORS при разработке
      '/api': {
        target:      'http://localhost:7898',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:7898',
        ws:     true,   // WebSocket проксирование
      },
    },
  },

  build: {
    outDir:    'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Разбиваем бандл на чанки для лучшего кэширования
        manualChunks: {
          'react-vendor':  ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor':  ['@reduxjs/toolkit', 'react-redux'],
          'ui-vendor':     ['@mui/material', '@emotion/react', '@emotion/styled'],
          'chart-vendor':  ['recharts'],
        },
      },
    },
  },
});