import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['regenerator-runtime/runtime']
  },
  build: {
    outDir: 'dist',
    commonjsOptions: {
      include: [/regenerator-runtime/],
      esmExternals: true
    }
  }
});
