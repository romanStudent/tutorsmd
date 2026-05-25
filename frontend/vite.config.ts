import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

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