import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      include: /\.(jsx?|tsx?)$/,
    }),
  ],
  // Expose REACT_APP_* env vars (CRA compat) in addition to VITE_*
  envPrefix: ['VITE_', 'REACT_APP_'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: true,
    ...(process.env.HMR_CLIENT_PORT
      ? { hmr: { clientPort: Number(process.env.HMR_CLIENT_PORT) } }
      : {}),
    proxy: {
      '/api': {
        target: process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    outDir: 'build',
    sourcemap: false,
  },
});
