# SauceDemo Checkout Scenarios

## Preconditions / notes
- Base URL: `SAUCEDEMO_BASE_URL` (default `https://www.saucedemo.com/`).
- Default authenticated user: `standard_user` / `secret_sauce` unless a scenario states otherwise. Use demo data from `domain/saucedemo/test-data.md`.
- Start each scenario from a clean browser context or explicitly cleared cookies/localStorage; cart contents persist in localStorage and can survive logout/login. [BR-CART-09, BR-AUTH-10]
- Checkout is a three-step UI flow: Your Information (`/checkout-step-one.html`) → Overview (`/checkout-step-two.html`) → Complete (`/checkout-complete.html`). [BR-CHK-01]
- Pricing assertions should compute expected values from selected item prices: Item total = sum of item prices; Tax = round(0.08 × Item total, 2); Total = Item total + Tax. Do not hard-code totals except documented examples. [BR-CHK-07, BR-CHK-15, BR-CHK-16]
- Open questions / assumptions: checkout with an empty cart is currently allowed by observed app behavior but is an open product question [BR-CART-11]; after Reset App State, visible Remove buttons may require reload before asserting refreshed state [BR-NAV-05]. Scenarios below note where these affect expectations.

## Happy Path

### Scenario: Successful single-item checkout completes the order
**Traceability:** BR-AUTH-01, BR-CART-01, BR-CHK-05, BR-CHK-06, BR-CHK-10, BR-CHK-13, BR-CHK-14; `specs/strategy/saucedemo-strategy.md` Checkout happy path.
**Given** `standard_user` is signed in with a clean cart
**And** the user has added `Sauce Labs Backpack` ($29.99) to the cart
**When** the user opens the cart and selects Checkout
**And** the user enters First Name `Test`, Last Name `User`, Postal Code `12345`
**And** the user continues to Overview and selects Finish
**Then** the user is on `/checkout-complete.html`
**And** the page displays the confirmation header "Thank you for your order!"
**And** the cart badge is hidden
**And** returning to the cart shows no items

## Business Rules

### Scenario: Checkout overview shows selected items, payment, shipping, and calculated totals
**Traceability:** BR-CHK-07, BR-CHK-08, BR-CHK-15, BR-CHK-16; `domain/saucedemo/ui-rules.md` Checkout Step 2 rules.
**Given** `standard_user` is signed in with a clean cart
**And** the cart contains `Sauce Labs Backpack` ($29.99) and `Sauce Labs Bike Light` ($9.99)
**When** the user proceeds through Checkout with valid customer information to the Overview step
**Then** the Overview lists exactly those two items with the same names, prices, and QTY 1
**And** Payment Information shows "SauceCard #31337"
**And** Shipping Information shows "Free Pony Express Delivery!"
**And** Item total is $39.98, Tax is $3.20, and Total is $43.18

### Scenario: Cancel from Your Information returns to cart with contents preserved
**Traceability:** BR-CHK-05; `domain/saucedemo/ui-rules.md` Checkout Step 1 rules.
**Given** `standard_user` is signed in
**And** the cart contains `Sauce Labs Onesie`
**When** the user starts checkout and reaches Your Information
**And** the user selects Cancel
**Then** the user is returned to `/cart.html`
**And** the cart still contains `Sauce Labs Onesie`
**And** the cart badge still reflects 1 item

### Scenario: Cancel from Overview returns to inventory with cart unchanged
**Traceability:** BR-CHK-09; `domain/saucedemo/ui-rules.md` Checkout Step 2 rules.
**Given** `standard_user` is signed in
**And** the cart contains `Sauce Labs Bike Light`
**When** the user proceeds to Checkout Overview with valid customer information
**And** the user selects Cancel
**Then** the user is returned to `/inventory.html`
**And** the cart still contains `Sauce Labs Bike Light`
**And** the cart badge still reflects 1 item

### Scenario: Back Home after completed checkout resets shopping state
**Traceability:** BR-CHK-13, BR-CHK-14; `domain/saucedemo/ui-rules.md` Checkout Step 3 rules.
**Given** `standard_user` has completed a checkout successfully
**When** the user selects Back Home on the checkout complete page
**Then** the user is returned to `/inventory.html`
**And** every product button reads "Add to cart"
**And** the cart badge is hidden

## Security

### Scenario: Unauthenticated user is redirected when accessing checkout pages directly
**Traceability:** BR-AUTH-09; `domain/saucedemo/ui-rules.md` Authentication and access.
**Given** the user is not authenticated in a clean browser context
**When** the user navigates directly to `/checkout-step-one.html`
**Then** the user is redirected to the login page
**And** an error message indicates "You can only access '/checkout-step-one.html' when you are logged in."
**When** the user navigates directly to `/checkout-step-two.html` and `/checkout-complete.html` while still unauthenticated
**Then** each request redirects to login with the corresponding path-specific access message

## Negative / Error

### Scenario: Missing required customer information shows top-to-bottom validation error
**Traceability:** BR-CHK-01, BR-CHK-02, BR-CHK-03, BR-CHK-04; `domain/saucedemo/ui-rules.md` Checkout Step 1 rules.
**Given** `standard_user` is signed in
**And** the cart contains at least one item
**And** the user is on Your Information
**When** the user selects Continue with First Name, Last Name, and Postal Code all empty
**Then** the user remains on `/checkout-step-one.html`
**And** the error "Error: First Name is required" is displayed
**When** the user enters First Name `Test` and leaves Last Name and Postal Code empty, then selects Continue
**Then** the error "Error: Last Name is required" is displayed
**When** the user enters First Name `Test` and Last Name `User`, leaves Postal Code empty, and selects Continue
**Then** the error "Error: Postal Code is required" is displayed

## Edge Cases

### Scenario: Postal code format is not validated beyond being non-empty
**Traceability:** `domain/saucedemo/ui-rules.md` Checkout Step 1 rules (product gap); BR-CHK-04 boundary.
**Given** `standard_user` is signed in
**And** the cart contains `Sauce Labs Backpack`
**And** the user is on Your Information
**When** the user enters First Name `Test`, Last Name `User`, and Postal Code `ABC`
**And** selects Continue
**Then** the user advances to `/checkout-step-two.html`
**And** the checkout is not blocked for postal code format
**And** the test records this as a known product gap, not a format-validation requirement

### Scenario: Checkout with an empty cart is treated as an open product question
**Traceability:** BR-CART-11; `domain/saucedemo/ui-rules.md` Cart open question.
**Given** `standard_user` is signed in
**And** the cart is empty
**When** the user navigates to `/cart.html` and selects Checkout
**Then** the observed behavior is recorded without asserting a product-approved pass/fail outcome
**And** if the app allows progression, the test documents the path reached and flags BR-CART-11 for product-owner clarification
**And** if the app blocks progression, the test documents the blocking message/state and flags BR-CART-11 for product-owner clarification

## UI State

### Scenario: Checkout information errors are visible on-page and clear after valid submission
**Traceability:** BR-CHK-01 to BR-CHK-04; `domain/saucedemo/ui-rules.md` Checkout Step 1 rules; `specs/strategy/saucedemo-strategy.md` UI timing/risk.
**Given** `standard_user` is signed in with at least one cart item on Your Information
**When** the user selects Continue with missing required fields
**Then** a visible validation error is shown on the same page
**And** the user remains on the Your Information step with entered field values preserved as applicable
**When** the user provides all required valid fields and selects Continue
**Then** the validation error is no longer blocking progression
**And** the user advances to the Overview step

