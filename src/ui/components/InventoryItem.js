export class InventoryItem {
  constructor(page, root) {
    this.page = page;
    this.root = root;
  }

  static byName(page, name) {
    return new InventoryItem(page, page.locator('.inventory_item').filter({ hasText: name }));
  }

  name() {
    return this.root.locator('.inventory_item_name');
  }

  addToCartButton() {
    return this.root.getByRole('button', { name: /add to cart/i });
  }

  removeButton() {
    return this.root.getByRole('button', { name: /remove/i });
  }
}
