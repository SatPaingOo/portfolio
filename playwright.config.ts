import { defineConfig, devices } from '@playwright/test';

/**
 * Tests run against a production build served by `vite preview`, not the dev
 * server. The dev server transforms three.js on demand, which timed tests out
 * under parallel workers, and sharing port 3000 with a running dev server kept
 * knocking that server over.
 */
const PORT = 4173;
const BASE = `http://localhost:${PORT}/portfolio/`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // The hero renders a WebGL scene. Headless Chromium draws it in software, and
  // too many at once starve each other of CPU and time out.
  workers: 3,
  reporter: [['list'], ['html', { outputFolder: 'e2e-report', open: 'never' }]],
  use: {
    baseURL: BASE,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    // Build every run so a stale dist is never tested; hence no reuse either.
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: BASE,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
