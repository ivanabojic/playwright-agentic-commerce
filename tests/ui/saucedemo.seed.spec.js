import { test, expect } from '@playwright/test';

test('SauceDemo login page is displayed', async ({ page }) => {
  const response = await page.goto('/');

  expect(response, 'The login page should return a response').not.toBeNull();
  expect(response.status()).toBeLessThan(400);
  await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  await expect(page).toHaveTitle(/Swag Labs/i);
});
