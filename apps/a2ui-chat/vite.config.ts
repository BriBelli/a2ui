import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@a2ui/core': path.resolve(__dirname, '../../libs/a2ui-core/src'),
      '@a2ui/lit': path.resolve(__dirname, '../../libs/a2ui-lit/src'),
    },
  },
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
