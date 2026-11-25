import { expect, test } from '../../src/fixtures/saucedemo.fixture.js';

test('adds a product to the cart', async ({ cartPage, header, inventoryPage, loginPage }) => {
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await inventoryPage.addItemToCartByName('Sauce Labs Backpack');
  await expect(header.cartBadge).toHaveText('1');

  await inventoryPage.openCart();
  await expect(cartPage.cartItems.filter({ hasText: 'Sauce Labs Backpack' })).toBeVisible();
});
