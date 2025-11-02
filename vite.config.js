import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      // Proxy all requests starting with /api to your Express server
      '/api': {
        target: 'http://localhost:3300',
        changeOrigin: true,
      },
    },
  },
});