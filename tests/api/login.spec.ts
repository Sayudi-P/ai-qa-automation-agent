import { test, expect } from '@playwright/test';

test.describe('Authentication API', () => {
  test('POST /users/login returns a valid access token', async ({ request }) => {
    const response = await request.post(
      'https://api.practicesoftwaretesting.com/users/login',
      {
        data: {
          email: 'admin@practicesoftwaretesting.com',
          password: 'welcome01',
        },
      }
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(typeof body.access_token).toBe('string');
    expect(body.access_token.length).toBeGreaterThan(0);

    expect(body.token_type).toBe('bearer');

    expect(typeof body.expires_in).toBe('number');
    expect(body.expires_in).toBeGreaterThan(0);
  });

  test('POST /users/login rejects invalid credentials', async ({ request }) => {
    const response = await request.post(
      'https://api.practicesoftwaretesting.com/users/login',
      {
        data: {
          email: 'admin@practicesoftwaretesting.com',
          password: 'wrong-password',
        },
      }
    );

    expect(response.status()).toBe(401);

    const body = await response.json();

    expect(body.error).toBe('Unauthorized');
  });
});
