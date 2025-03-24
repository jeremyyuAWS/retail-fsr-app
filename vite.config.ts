import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Ensures that imports from 'react' resolve to the proper version
      'react': path.resolve(__dirname, 'node_modules/react')
    }
  },
  optimizeDeps: {
    include: ['regenerator-runtime/runtime', 'lucide-react']
  },
  build: {
    outDir: 'dist',
    commonjsOptions: {
      include: [/regenerator-runtime/],
      esmExternals: true
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  }
});
