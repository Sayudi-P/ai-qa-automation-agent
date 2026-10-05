import { test, expect } from '@playwright/test';

test.describe('Practice Software Testing UI', () => {
  test('homepage loads successfully', async ({ page }) => {
    const response = await page.goto('https://practicesoftwaretesting.com/');

    expect(response).not.toBeNull();
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/Practice Software Testing/i);

    await expect(page.locator('body')).toContainText(
  'Practice Black Box Testing & Bug Hunting Testing Guide'
);
  });
});
