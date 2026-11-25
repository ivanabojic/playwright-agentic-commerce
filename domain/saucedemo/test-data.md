# SauceDemo Test Data

Demo site: https://www.saucedemo.com/

## Standard users
Common demo credentials (publicly documented by SauceDemo):
- `standard_user` / `secret_sauce` — normal user for happy-path flows
- `locked_out_user` / `secret_sauce` — login should be denied
- `problem_user` / `secret_sauce` — UI/data issues for negative/resilience scenarios
- `performance_glitch_user` / `secret_sauce` — slower responses for timing/performance-related scenarios
- `error_user` / `secret_sauce`, `visual_user` / `secret_sauce` — additional behavior variants (use intentionally)

## Checkout information
Example valid customer details for checkout forms:
- First name: `Test`
- Last name: `User`
- Postal code: `12345`

## Products / cart data
- Inventory is fixed demo catalog (e.g. "Sauce Labs Backpack", "Sauce Labs Bike Light", etc.). Prefer selecting items by visible name or stable `data-test` identifiers rather than assuming order unless sort is set.
- Keep tests independent by logging in with a fresh context and adding only the items required for the scenario.

## Notes
- Do not store non-demo secrets; these credentials are public demo values.
- If the demo UI or catalog changes, update selectors/data and assertions to match observed behavior.
