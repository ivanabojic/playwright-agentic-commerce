---
name: playwright-best-practice
description: Canonical Playwright automation standards and implementation guidance for this repo (locators, waits, assertions, structure, fixtures, project conventions, and anti-patterns)
user-invocable: false
---

# Playwright Best Practices (Canonical)

**Role:** Reference-only canonical standards (not directly invokable). Other agents, reviews, and implementations should apply this guidance.

## Purpose
Canonical source of Playwright E2E/API automation rules and implementation guidance for the SauceDemo UI and Reqres API projects in this repository. Use this guidance when writing or refactoring automation code; `review-tests` and other agents should evaluate changes against it.

## Knowledge sources and alignment
- [playwright.config.js](../../playwright.config.js) — projects (`saucedemo-ui`, `reqres-api`), test dirs, base URLs, retries/reporting.
- [copilot-instructions.md](../copilot-instructions.md) and scoped instructions in [instructions/](../instructions/).
- `domain/saucedemo/*`, `domain/reqres/*` — business rules, test data, endpoints/contracts.
- `specs/strategy/*`, `specs/scenarios/*` — intended coverage and expected behavior.
- Existing `src/` and `tests/` — established patterns and reusable helpers.

## Applicable code areas
- **UI (SauceDemo, `tests/ui/`, `src/ui/`)**: implement/refactor Page Objects in `src/ui/pages/`, reusable components in `src/ui/components/`, and UI specs in `tests/ui/`.
- **API (Reqres, `tests/api/`, `src/api/`)**: implement/refactor API clients/helpers in `src/api/clients/`, shared structures/helpers in `src/api/models/` as appropriate, and API specs in `tests/api/`.
- **Fixtures**: create/maintain shared fixtures in `src/fixtures/`.
- **Placement**: put executable automation code in `src/` or `tests/`. Planning artifacts belong in `specs/` (not `docs/`) when explicitly requested.
- Keep code readable, well-structured, and consistent with repository conventions (JavaScript/ESM).

## Canonical rules

### Locators and synchronization
- Prefer stable locators: `data-test` attributes, accessible roles/names, labels, and user-visible text. Avoid brittle CSS/XPath and nth-child/deep structural selectors.
- Rely on Playwright auto-waiting and explicit expectations (e.g. `await expect(locator).toBeVisible()`, URL/state assertions). Do not use `page.waitForTimeout()` or fixed sleeps.
- Wait for and assert the resulting application state after actions, not transient transitions.

### Assertions and correctness
- Assert meaningful outcomes: page/URL/headings, visible content, item presence/counts, cart/badge state, checkout/messages, API status codes, and required response/body fields or schemas.
- Avoid false-positive assertions (e.g. only checking navigation or that a click did not throw). Assertions must reflect the scenario/domain expectation.
- For API tests, validate response contracts/status and required fields; allow additive metadata where documented.

### Test independence and data
- Keep tests independent and order-agnostic. Arrange required state explicitly (login, cart contents, request setup) and avoid cross-test coupling or leakage.
- Use environment-configured base URLs (`SAUCEDEMO_BASE_URL`/`BASE_URL`, `REQRES_BASE_URL`/`API_BASE_URL`) instead of hardcoded endpoints.
- Do not hardcode secrets beyond documented demo credentials; centralize reusable test data/fixtures/helpers.

### Project-specific rules
- **SauceDemo UI (`saucedemo-ui`)**: follow `domain/saucedemo/ui-rules.md` and `domain/saucedemo/test-data.md`. Respect authentication/session behavior, cart persistence/state, user variants, and checkout/inventory rules. Assert visible UI outcomes and state changes.
- **Reqres API (`reqres-api`)**: follow `domain/reqres/api-rules.md` and `domain/reqres/endpoints-schema.md`. Treat classic demo writes as non-persisted (assert response contract/shape, not durable side effects), consider rate limits/additive metadata, and keep read validations deterministic where possible.

### Debugging and commands
- Run specific specs/projects:
  - `npx playwright test tests/ui/<spec>.spec.js --project=saucedemo-ui`
  - `npx playwright test tests/api/<spec>.spec.js --project=reqres-api`
- Interactive/debug/reporting: `npx playwright test --ui`, `npx playwright show-report`
- Use temporary diagnostic logs only when needed and remove them before finalizing.

## Anti-patterns

| Anti-pattern | Why it's bad | Do instead |
| --- | --- | --- |
| `page.waitForTimeout(N)` / fixed sleeps | Flaky and slow | Use auto-waiting and explicit expectations on state/visibility/response |
| Brittle selectors (deep CSS/XPath, nth-child chains) | Break on UI changes | Use `data-test`, roles, labels, or stable user-visible locators |
| Shared or leaked state between tests | Order-dependent failures | Make each test self-contained; arrange/reset state explicitly |
| Hardcoded URLs/credentials/test data | Environment drift and duplication | Use env vars, fixtures, domain/test-data sources |
| Weak assertions (navigation/click only) | False positives | Assert meaningful UI/API outcomes and domain-required behavior |
| Assuming Reqres demo writes persist | Demo behavior is not durable | Assert response status/shape/fields per contract; do not chain on persisted mutations |

## Usage
- Apply these rules when implementing or refactoring tests, POMs/components, clients/helpers, and fixtures.
- When reviewing, report violations against this document together with applicable scoped instructions, `domain/`, and `specs/`.
