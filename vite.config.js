import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 8080, allowedHosts: true },
  preview: { host: true, port: 8080, allowedHosts: true },
  resolve: {
    alias: { '@': path.resolve(process.cwd(), 'src') },
  },
});
