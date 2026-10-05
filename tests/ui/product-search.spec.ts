import { test, expect } from '@playwright/test';

test.describe('Product Search UI', () => {
  test('searching for hammer returns relevant products', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/', {
      waitUntil: 'commit',
      timeout: 30_000,
    });

    const searchInput = page.locator('#search-query');

    const searchButton = page.getByRole('button', {
      name: 'Search',
      exact: true,
    });

    await expect(searchInput).toBeVisible({
      timeout: 15_000,
    });

    await expect(searchButton).toBeVisible({
      timeout: 15_000,
    });

    await searchInput.fill('hammer');
    await searchButton.click();

    await expect(
      page.getByRole('heading', {
        name: 'Searched for: hammer',
        exact: true,
      })
    ).toBeVisible({
      timeout: 15_000,
    });

    const productCards = page
      .locator('a.card')
      .filter({ hasText: /hammer/i });

    await expect(productCards.first()).toBeVisible({
      timeout: 15_000,
    });

    expect(await productCards.count()).toBeGreaterThan(0);
  });
});
