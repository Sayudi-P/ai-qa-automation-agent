import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  timeout: 30_000,

  use: {
    baseURL:
      process.env.API_BASE_URL ||
      'https://api.practicesoftwaretesting.com',
  },

  reporter: [
    ['list'],

    [
      'html',
      {
        outputFolder: 'reports/html',
        open: 'never',
      },
    ],

    [
      'json',
      {
        outputFile: 'reports/test-results.json',
      },
    ],

    [
      'junit',
      {
        outputFile: 'reports/junit.xml',
      },
    ],
  ],
});
