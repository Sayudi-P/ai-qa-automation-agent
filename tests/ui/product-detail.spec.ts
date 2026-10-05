import { test, expect } from '@playwright/test';

test.describe('Product Detail UI', () => {
  test('opening the Hammer product displays correct product details', async ({
    page,
  }) => {
    // Open homepage.
    await page.goto('https://practicesoftwaretesting.com/', {
      waitUntil: 'commit',
    });

    // Search for hammer.
    await page.locator('#search-query').fill('hammer');

    await page.getByRole('button', {
      name: 'Search',
      exact: true,
    }).click();

    // Wait until search results are visible.
    await expect(
      page.getByRole('heading', {
        name: 'Searched for: hammer',
        exact: true,
      })
    ).toBeVisible({
      timeout: 15_000,
    });

    // Wait until the exact Hammer product appears.
    const hammerProduct = page.getByRole('heading', {
      name: 'Hammer',
      exact: true,
    });

    await expect(hammerProduct).toBeVisible({
      timeout: 15_000,
    });

    // Open the product detail page.
    await hammerProduct.click();

    // Verify product detail URL.
    await expect(page).toHaveURL(/\/product\//, {
      timeout: 15_000,
    });

    // Verify product title.
    await expect(
      page.getByRole('heading', {
        name: 'Hammer',
        exact: true,
      })
    ).toBeVisible();

    // Verify brand.
    await expect(
      page.getByText('ForgeFlex Tools', {
        exact: true,
      })
    ).toBeVisible();

    // Verify product price.
    await expect(
      page.getByText('$12.58', {
        exact: true,
      })
    ).toBeVisible();

    // Verify product description is displayed.
    await expect(
      page.getByText(
        /A dependable standard claw hammer suitable for driving and removing nails/i
      )
    ).toBeVisible();

    // Verify Add to cart button.
    await expect(
      page.locator('#btn-add-to-cart')
    ).toBeVisible();

    // Verify product specifications.
    await expect(
      page.getByText('Handle Material', {
        exact: true,
      })
    ).toBeVisible();

    await expect(
      page.getByText('Carbon Steel', {
        exact: true,
      })
    ).toBeVisible();
  });
});
