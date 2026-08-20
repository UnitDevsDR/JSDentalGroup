import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  // Express monta este panel bajo /admin, no en la raíz del sitio
  base: '/admin/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  // el build sale directo a public/admin: Express lo sirve estático, sin
  // otro proceso/servicio que mantener
  build: {
    outDir: '../public/admin',
    emptyOutDir: true,
  },
});
