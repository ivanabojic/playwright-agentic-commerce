import { test as base } from '@playwright/test';
import { CartPage } from '../ui/pages/CartPage.js';
import { CheckoutPage } from '../ui/pages/CheckoutPage.js';
import { Header } from '../ui/components/Header.js';
import { InventoryPage } from '../ui/pages/InventoryPage.js';
import { LoginPage } from '../ui/pages/LoginPage.js';

export const test = base.extend({
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  header: async ({ page }, use) => {
    await use(new Header(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';
