import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main:       resolve(__dirname, 'index.html'),
        rain:       resolve(__dirname, 'rain.html'),
        earthquake: resolve(__dirname, 'earthquake.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
    middlewareMode: false,
  },
});
