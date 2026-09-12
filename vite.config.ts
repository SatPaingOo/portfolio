import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/portfolio/',
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    // Pre-bundle the lazily imported 3D stack at startup. Discovered on first
    // use instead, Vite re-optimizes mid-session and the page ends up running
    // two copies of React ("Invalid hook call").
    optimizeDeps: {
      include: ['three', '@react-three/fiber', 'three/examples/jsm/utils/BufferGeometryUtils.js'],
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            // three.js is deliberately not listed. HeroHead lazy-loads it, and a
            // manual chunk pulls shared modules in and forces an eager preload.
            'chart-vendor': ['recharts']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    }
  };
});
