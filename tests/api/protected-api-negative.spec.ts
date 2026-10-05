import { test, expect } from '@playwright/test';

test.describe('Protected API Negative Tests', () => {
  test('GET /invoices rejects unauthenticated request', async ({ request }) => {
    const response = await request.get(
      'https://api.practicesoftwaretesting.com/invoices'
    );

    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body.message).toBe('Unauthorized');
  });
});
