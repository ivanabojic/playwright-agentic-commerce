# SauceDemo Checkout Scenarios

## Preconditions / notes
- Base URL: `SAUCEDEMO_BASE_URL` (default `https://www.saucedemo.com/`).
- Most flows require a signed-in user (e.g. `standard_user` / `secret_sauce`).
- Cart state is session-specific; start from a clean session or known cart state.
- Use test data from `domain/saucedemo/test-data.md`.

## Scenario: Successful checkout with a standard user
**Given** a standard user is logged in to SauceDemo  
**And** the user has at least one item in the cart  
**When** the user proceeds to checkout  
**And** provides valid customer information (first name, last name, postal code)  
**And** continues to the overview and finishes the order  
**Then** the checkout complete page is displayed  
**And** a confirmation message such as "Thank you for your order!" is shown

## Scenario: Checkout information is required
**Given** a standard user is logged in and has an item in the cart  
**When** the user proceeds to checkout  
**And** attempts to continue without required customer information  
**Then** the user remains on the information step  
**And** a validation error is displayed

## Scenario: Locked out user cannot access inventory
**Given** a user is on the SauceDemo login page  
**When** the user attempts to sign in with locked-out credentials  
**Then** login is rejected  
**And** an error message indicates the user is locked out

## Scenario: Cart badge updates when adding an item
**Given** a standard user is logged in and viewing inventory  
**When** the user adds a product to the cart  
**Then** the cart badge/count reflects the added item  
**And** the cart page lists the selected product
