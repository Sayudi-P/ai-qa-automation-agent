import { test, expect } from '@playwright/test';

test.describe('Protected API', () => {
  test('authenticated user can access GET /invoices', async ({ request }) => {
    // Step 1: Login
    const loginResponse = await request.post(
      'https://api.practicesoftwaretesting.com/users/login',
      {
        data: {
          email: 'admin@practicesoftwaretesting.com',
          password: 'welcome01',
        },
      }
    );

    expect(loginResponse.status()).toBe(200);

    const loginBody = await loginResponse.json();

    expect(typeof loginBody.access_token).toBe('string');
    expect(loginBody.access_token.length).toBeGreaterThan(0);

    // Step 2: Extract token
    const accessToken = loginBody.access_token;

    // Step 3: Call protected endpoint
    const invoicesResponse = await request.get(
      'https://api.practicesoftwaretesting.com/invoices',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Step 4: Validate protected response
    expect(invoicesResponse.status()).toBe(200);

    const invoicesBody = await invoicesResponse.json();

    // Step 5: Validate response structure
    expect(invoicesBody).toBeDefined();
  });
});
