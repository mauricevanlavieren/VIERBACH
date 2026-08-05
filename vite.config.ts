import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // Relative base: works at the default project URL (/VIERBACH/) and at the
    // custom domain (https://vierbach.nl/) once DNS is set up.
    base: './',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Stuur API- en uploads-verzoeken in dev door naar de lokale PHP-server:
      //   php -S 127.0.0.1:8000 -t backend
      proxy: {
        '/api': 'http://127.0.0.1:8000',
        '/uploads': 'http://127.0.0.1:8000',
      },
    },
  };
});
