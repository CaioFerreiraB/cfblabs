import { defineConfig, devices } from '@playwright/test';

const origin = 'http://127.0.0.1:4321';
const base = (process.env.BASE_PATH ?? '').replace(/\/$/, '');

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: { ...devices['Desktop Chrome'], baseURL: origin, trace: 'on-first-retry' },
  webServer: {
    command: 'node scripts/serve-preview.mjs',
    url: `${origin}${base}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
