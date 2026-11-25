---
applyTo:
  - tests/ui/**
  - src/ui/**
  - domain/saucedemo/**
  - specs/**/*saucedemo*
---

# SauceDemo UI Instructions

Scope: SauceDemo (Swag Labs) UI automation (`tests/ui/**`, `src/ui/**`).

## Domain and environment
- Default base URL: `https://www.saucedemo.com/` (`SAUCEDEMO_BASE_URL` / `BASE_URL` override).
- Key areas: login, inventory/product listing, product details, cart, checkout (information, overview, complete).
- Follow [domain/saucedemo/ui-rules.md](../../domain/saucedemo/ui-rules.md) and [domain/saucedemo/test-data.md](../../domain/saucedemo/test-data.md).

## Implementation rules
- Use Page Objects (`src/ui/pages`) and reusable UI components (`src/ui/components`) instead of duplicating selectors in specs.
- Prefer stable selectors (e.g. `data-test` attributes, roles, labels). Avoid brittle CSS/XPath tied to layout.
- SauceDemo requires authentication before inventory/cart flows for standard users; arrange login state explicitly via UI or fixtures/helpers as appropriate.
- Cart badge/count and checkout steps update after user actions; assert resulting page state, visible items, and totals/messages rather than transient UI.
- Keep tests independent: set up required state, avoid cross-test coupling, and reset cart/session effects when practical.

## Reliability
- Avoid fixed sleeps; use Playwright auto-waiting and explicit expectations.
- Capture meaningful assertions (URL/page heading, item presence, cart count, checkout completion message) rather than only navigation.
- Do not hardcode secrets beyond documented demo credentials; centralize test users/data.
