# SauceDemo UI Test Strategy

## Scope
Automate critical SauceDemo (Swag Labs) user journeys in `tests/ui/` using Playwright (`saucedemo-ui` project).
- In scope: login, inventory browsing/sorting basics, add/remove cart items, cart contents/badge, and checkout flow (information, overview, completion).
- Out of scope (initially): visual testing, performance benchmarking beyond demo user behavior, and non-documented backend integrations.

## Risks
- **Authentication/state**: most flows require a logged-in session; tests must arrange login and isolate browser/storage state.
- **User variants**: locked-out/problem/performance-glitch users behave differently; select users intentionally per scenario.
- **Cart state leakage**: cart contents persist within session; reset/arrange state per test.
- **UI timing**: navigation and DOM updates after actions require reliable waits/assertions (no fixed sleeps).

## Coverage matrix (initial)

| Risk / Area | Coverage | Scenario / Spec |
|---|---|---|
| Login page / auth | Smoke | `tests/ui/saucedemo.seed.spec.js` |
| Standard login & inventory access | Planned | login/inventory specs |
| Add/remove items & cart badge | Planned | `tests/ui/add-to-cart.spec.js` |
| Checkout happy path | Planned | `specs/scenarios/saucedemo-checkout.scenarios.md` |
| Negative login / validation | Planned | error-state specs |

## Test data and environment
- Base URL: `SAUCEDEMO_BASE_URL` (default `https://www.saucedemo.com/`).
- Use domain rules/data in `domain/saucedemo/ui-rules.md` and `domain/saucedemo/test-data.md`.
- Prefer resilient `data-test` selectors and user-visible assertions; avoid order dependence unless sort is explicit.
