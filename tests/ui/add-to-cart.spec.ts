import { test, expect } from '@playwright/test';

test.describe('Add to Cart UI', () => {
  test('adding the Hammer product to cart updates the cart count', async ({
    page,
  }) => {
    await page.goto('https://practicesoftwaretesting.com/', {
      waitUntil: 'commit',
      timeout: 30_000,
    });

    const searchInput = page.locator('#search-query');

    const searchButton = page.getByRole('button', {
      name: 'Search',
      exact: true,
    });

    // Wait for the Angular application to render the search controls.
    await expect(searchInput).toBeVisible({
      timeout: 20_000,
    });

    await expect(searchButton).toBeVisible({
      timeout: 10_000,
    });

    // Search for hammer.
    await searchInput.fill('hammer');
    await searchButton.click();

    // Wait for the search result state.
    await expect(
      page.getByRole('heading', {
        name: 'Searched for: hammer',
        exact: true,
      })
    ).toBeVisible({
      timeout: 15_000,
    });

    // Find the exact Hammer product.
    const hammerProduct = page.getByRole('heading', {
      name: 'Hammer',
      exact: true,
    });

    await expect(hammerProduct).toBeVisible({
      timeout: 15_000,
    });

    await hammerProduct.click();

    // Verify product detail page.
    await expect(page).toHaveURL(/\/product\//, {
      timeout: 15_000,
    });

    await expect(
      page.getByRole('heading', {
        name: 'Hammer',
        exact: true,
      })
    ).toBeVisible({
      timeout: 15_000,
    });

    // Add the product to the cart.
    const addToCartButton = page.locator('#btn-add-to-cart');

    await expect(addToCartButton).toBeVisible({
      timeout: 15_000,
    });

    await expect(addToCartButton).toBeEnabled();

    await addToCartButton.click();

    // Verify that the cart count changed to 1.
    const cartCount = page.locator('#lblCartCount');

    await expect(cartCount).toBeVisible({
      timeout: 10_000,
    });

    await expect(cartCount).toHaveText('1');
  });
});
