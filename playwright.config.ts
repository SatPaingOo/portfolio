import { defineConfig, devices } from '@playwright/test';

const BASE = 'http://localhost:3000/portfolio/';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
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
    command: 'npm run dev',
    url: BASE,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
