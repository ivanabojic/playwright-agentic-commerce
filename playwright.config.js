import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: 'html',
  outputDir: 'test-results',

  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'saucedemo-ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.SAUCEDEMO_BASE_URL || process.env.BASE_URL || 'https://www.saucedemo.com/',
      },
    },
    {
      name: 'reqres-api',
      testDir: './tests/api',
      use: {
        baseURL: process.env.REQRES_BASE_URL || process.env.API_BASE_URL || 'https://reqres.in/',
      },
    },
  ],
});
