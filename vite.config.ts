import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En GitHub Pages el sitio vive en /invitacion-matrimonio/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/invitacion-matrimonio/' : '/',
  plugins: [react()],
  server: { host: true, port: 5173 },
}));
