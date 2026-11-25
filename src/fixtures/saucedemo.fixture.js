import { test as base } from '@playwright/test';
import { LoginPage } from '../ui/pages/LoginPage.js';
import { InventoryPage } from '../ui/pages/InventoryPage.js';
import { CartPage } from '../ui/pages/CartPage.js';
import { CheckoutPage } from '../ui/pages/CheckoutPage.js';

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect } from '@playwright/test';
