import { test, expect } from '@playwright/test';

test.describe('Products API Pagination', () => {
  test('GET /products returns valid pagination metadata', async ({ request }) => {
    const response = await request.get(
      'https://api.practicesoftwaretesting.com/products'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(typeof body.current_page).toBe('number');
    expect(body.current_page).toBeGreaterThanOrEqual(1);

    expect(Array.isArray(body.data)).toBe(true);

    expect(typeof body.per_page).toBe('number');
    expect(body.per_page).toBeGreaterThan(0);

    expect(body.data.length).toBeLessThanOrEqual(body.per_page);

    expect(typeof body.total).toBe('number');
    expect(body.total).toBeGreaterThanOrEqual(body.data.length);

    expect(typeof body.last_page).toBe('number');
    expect(body.last_page).toBeGreaterThanOrEqual(body.current_page);
  });
});
