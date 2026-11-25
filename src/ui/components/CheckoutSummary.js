export class CheckoutSummary {
  constructor(page) {
    this.page = page;
    this.items = page.locator('.cart_item');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
  }
}
