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
          // Only React is split out by hand. Everything else follows its
          // import: recharts rides along in the lazy chart chunk, three.js in
          // the lazy head chunk.
          //
          // Matched on the module id rather than listed by package name. The
          // list form named 'react-dom', which is the package entry nothing
          // imports: the app uses 'react-dom/client', so the whole 190 kB
          // renderer stayed behind in the entry chunk and react-vendor came
          // out at 12 kB. Rollup gives ids POSIX separators on every platform.
          manualChunks(id: string) {
            // Rollup's CommonJS interop helpers are shared by every CJS
            // package in the build. Left to land wherever, they went into the
            // recharts chunk and react-vendor imported them back out of it,
            // making the two circular: the recharts chunk then evaluated
            // first and read forwardRef off an uninitialised React. Pinning
            // the helpers beside React breaks the cycle.
            if (id.includes('commonjsHelpers')) return 'react-vendor';
            if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react-vendor';
            return undefined;
          }
        }
      },
      chunkSizeWarningLimit: 1000
    }
  };
});
