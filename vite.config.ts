import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        "target": "https://gpt-ish.com",
        "changeOrigin": true,
        "secure": true,
        "ws": true
      }
    }
  },
  build: {
    target: 'esnext',
    sourcemap: true,
  },
});
