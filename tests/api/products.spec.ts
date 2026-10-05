import { test, expect } from '@playwright/test';

test.describe('Products API', () => {
  test('GET /products returns a valid product collection', async ({ request }) => {
    const response = await request.get(
      'https://api.practicesoftwaretesting.com/products'
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    for (const product of body.data) {
      expect(product.name).toBeTruthy();
      expect(typeof product.price).toBe('number');
    }
  });
});
