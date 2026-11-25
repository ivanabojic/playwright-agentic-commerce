# SauceDemo UI Rules

Source demo: [SauceDemo (Swag Labs)](https://www.saucedemo.com/)
Aligned with: *SauceDemo Business Rules – QA Automation Reference* (BR-IDs in brackets). Where the two differ, the business rules doc wins; confirm against the live site before logging a defect.

## Authentication and access
- Login is required before inventory, product detail, cart, and checkout pages. Opening any of these URLs directly redirects to login with "You can only access '<path>' when you are logged in." [BR-AUTH-09]
- All demo accounts use password `secret_sauce`. Credentials are case-sensitive. [BR-AUTH-01, 06]
- Failed logins keep the user on the login page with an "Epic sadface" error [BR-AUTH-02 to 05]:
  - Empty username → "Username is required"
  - Empty password → "Password is required"
  - Wrong credentials → "Username and password do not match any user in this service"
  - `locked_out_user` → "Sorry, this user has been locked out."
- The error can be dismissed with its X button. [BR-AUTH-08]
- Logout (menu > Logout) ends the login session: the `session-username` cookie is cleared and Back cannot reopen protected pages. [BR-AUTH-10, 11]
- **Logout does not clear the cart.** Cart contents live in localStorage and survive logout. Only a fresh browser context, cleared storage, Reset App State, or a completed order empties it. [BR-CART-09, BR-NAV-05, BR-CHK-14]

## Test personas
Choose users intentionally. `standard_user` is the baseline that must pass every rule; the others are known-bad accounts, and a test on them "passes" when it detects the fault. [BR-USR-01 to 06]

| User | Behavior |
|---|---|
| `standard_user` | Fully working app |
| `locked_out_user` | Login blocked |
| `problem_user` | Wrong images, sorting has no effect, some Add/Remove buttons fail, Last Name input misbehaves |
| `performance_glitch_user` | Slow login and pages; flows must finish within a defined threshold |
| `error_user` | Some cart actions, checkout fields, and Finish fail or throw errors |
| `visual_user` | Layout, image, and price glitches |

Persona faults can change between releases: keep them in a known-issues list, not in test code, and run persona tests in a separate suite from the P1 smoke run.

## Inventory and products
- The Products page lists exactly six items, each with image, name, description, price, and an Add to cart button. [BR-INV-01]
- Prices display as `$X.XX` (regex `^\$\d+\.\d{2}$`). [BR-INV-02]
- Default sort is Name (A to Z); the sort dropdown shows the active option. [BR-INV-03, 08]

| # | Product | Price |
|---|---|---|
| 1 | Sauce Labs Backpack | $29.99 |
| 2 | Sauce Labs Bike Light | $9.99 |
| 3 | Sauce Labs Bolt T-Shirt | $15.99 |
| 4 | Sauce Labs Fleece Jacket | $49.99 |
| 5 | Sauce Labs Onesie | $7.99 |
| 6 | Test.allTheThings() T-Shirt (Red) | $15.99 |

- Sort options and expected results [BR-INV-04 to 07]:
  - Name (Z to A): first item is Test.allTheThings() T-Shirt (Red)
  - Price (low to high): first Onesie $7.99, last Fleece Jacket $49.99
  - Price (high to low): the reverse
  - The two $15.99 items stay adjacent
- Clicking a product's name or image opens `/inventory-item.html?id=<n>`, which shows the same name, description, price, and image as the card. [BR-PDP-01, 02]
- Add to cart / Remove on the detail page behaves exactly as on Products. Back to products returns to the list with the cart unchanged. [BR-PDP-03, 04]
- An unknown product id shows "ITEM NOT FOUND". [BR-PDP-05]

## Cart
- Add to cart adds one unit, turns the button into "Remove", and adds 1 to the badge. Remove reverses both. [BR-CART-01, 02]
- The badge equals the number of distinct items and is hidden when the cart is empty. [BR-CART-03]
- Quantity is always 1 per product; there is no quantity control. [BR-CART-04]
- Button state matches cart state on both the Products and detail pages. [BR-CART-10]
- The cart page lists exactly the added items (name, description, price, QTY). Remove deletes the line and updates the badge. [BR-CART-05, 06]
- Continue Shopping returns to Products with the cart unchanged; Checkout opens `/checkout-step-one.html`. [BR-CART-07, 08]
- The cart persists across page reloads and logout/login as the same user. [BR-CART-09]
- **Open question:** the app allows checkout with an empty cart. Confirm with the product owner whether this is accepted or a defect. [BR-CART-11]

## Checkout
Three steps [BR-CHK-01 to 16]:
1. **Your Information** (`/checkout-step-one.html`): First Name, Last Name, Zip/Postal Code.
2. **Overview** (`/checkout-step-two.html`): items, payment, shipping, price summary.
3. **Complete** (`/checkout-complete.html`): confirmation and Back Home.

**Step 1 rules**
- All three fields are required. Errors appear on the page, checked top to bottom, so with all fields empty only the first error shows:
  - "Error: First Name is required"
  - "Error: Last Name is required"
  - "Error: Postal Code is required"
- Only empty fields are rejected. There is no format or length validation (letters in Zip are accepted); treat this as a product gap, not a test failure.
- Continue opens Overview; Cancel returns to the cart with contents unchanged.

**Step 2 rules**
- Overview lists exactly the cart items with the same names, prices, and QTY.
- Pricing (compute expected values in the test, never hard-code totals):
  - Item total = sum of item prices
  - Tax = round(0.08 × Item total, 2)
  - Total = Item total + Tax
  - Example: Backpack $29.99 + Bike Light $9.99 → Item total $39.98, Tax $3.20, Total $43.18
- Payment shows "SauceCard #31337"; shipping shows "Free Pony Express Delivery!"
- Cancel returns to Products with the cart unchanged.

**Step 3 rules**
- Finish shows "Thank you for your order!" and empties the cart (badge hidden, cart page empty).
- Back Home returns to Products with every button reading "Add to cart".

## Navigation and footer
- The burger menu opens with its icon and closes with X. It offers four actions on every logged-in page [BR-NAV-01 to 05]:
  - All Items → `/inventory.html`
  - About → saucelabs.com
  - Logout → see Authentication
  - Reset App State → empties the cart; the user stays logged in
- **Known nuance:** after Reset App State, "Remove" buttons already on screen may not refresh until reload. Decide whether tests assert before or after a reload.
- The cart icon opens `/cart.html` from any page. [BR-NAV-06]
- The footer shows Twitter/X, Facebook, and LinkedIn links to Sauce Labs' profiles and a copyright line. [BR-NAV-07]

## Automation guidance
- **Traceability:** tag every test with its rule ID, e.g. `@BR-CHK-09`. A rule with no test is a coverage gap; a test with no rule needs a rule or should be removed.
- **Priorities:** P1 (purchase path or security) runs on every commit; P2 (core behavior and validation) nightly; P3 (cosmetic and edge cases) weekly.
- **Locators:** prefer `data-test` attributes, then accessible roles/names. Verify each locator against the live DOM once when building page objects.

| Area | `data-test` values |
|---|---|
| Login | `username`, `password`, `login-button`, `error` |
| Inventory | `product-sort-container`, `inventory-item-name`, `inventory-item-price`, `add-to-cart-<product-slug>`, `remove-<product-slug>` |
| Header | `shopping-cart-link`, `shopping-cart-badge` |
| Cart | `continue-shopping`, `checkout` |
| Checkout | `firstName`, `lastName`, `postalCode`, `continue`, `cancel`, `finish`, `subtotal-label`, `tax-label`, `total-label`, `complete-header`, `back-to-products` |

  Product slugs follow the product name, e.g. `add-to-cart-sauce-labs-backpack`.
- **Independence:** start each test from a fresh browser context (or clear cookies and localStorage, or use Reset App State) so cart persistence never leaks between tests.
- **Test data:** keep usernames, the password, and the reference catalog in one fixture file, not in tests.
- **Waiting:** rely on Playwright auto-waiting and user-visible assertions; never use fixed sleeps (`performance_glitch_user` exposes them).
- **Coverage order:** P1 end-to-end purchase (BR-AUTH-01, BR-CART-01, BR-CHK-05 to 14) → validation (BR-AUTH-02 to 06, BR-CHK-01 to 04) → sorting and details → personas and P3 rules.

## Open questions
- Session cookie expiry window: confirm on the live site before writing a timeout test. [BR-AUTH-11]
- Checkout with an empty cart: accepted behavior or defect? [BR-CART-11]
- After Reset App State: assert before or after reload? [BR-NAV-05]
