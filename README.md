# Playwright Agentic Commerce

Playwright automation for the **SauceDemo** (Swag Labs) UI and the **Reqres** REST API.

## Project structure

- `.github/` — Copilot instructions, scoped guidance, and custom agent definitions
- `.vscode/mcp.json` — Playwright MCP configuration for live SauceDemo browser exploration
- `domain/` — business rules and API contracts/test data
  - `domain/saucedemo/` (`ui-rules.md`, `test-data.md`)
  - `domain/reqres/` (`api-rules.md`, `endpoints-schema.md`)
- `specs/` — strategy and scenario artifacts
  - `specs/strategy/` (`saucedemo-strategy.md`, `reqres-strategy.md`)
  - `specs/scenarios/` (`saucedemo-checkout.scenarios.md`, `reqres-users.scenarios.md`)
- `src/` — implementation layers
  - `src/ui/pages/` (`LoginPage.js`, `InventoryPage.js`, `CartPage.js`, `CheckoutPage.js`)
  - `src/ui/components/` (`Header.js`, `InventoryItem.js`, `CheckoutSummary.js`)
  - `src/api/clients/` (`AuthClient.js`, `UsersClient.js`, `ResourceClient.js`)
  - `src/api/models/` (`auth.js`, `user.js`, `resource.js`)
  - `src/fixtures/` (`saucedemo.fixture.js`, `reqres.fixture.js`)
- `tests/` — executable specs
  - `tests/ui/` (`saucedemo.seed.spec.js`, `add-to-cart.spec.js`)
  - `tests/api/` (`reqres.seed.spec.js`, `users.spec.js`)
- `playwright.config.js` — Playwright projects: `saucedemo-ui` and `reqres-api`

## Test targets

- **SauceDemo UI:** [SauceDemo / Swag Labs](https://www.saucedemo.com/)
- **Reqres API:** [Reqres](https://reqres.in/) ([docs](https://reqres.in/docs))

## Prerequisites

- Node.js and npm
- Internet access to SauceDemo and Reqres (or reachable deployments)
- Playwright Chromium browser

## Setup

```powershell
npm install
npx playwright install chromium
```

Environment variables (`.env` / CI):
- `SAUCEDEMO_BASE_URL` (default: `https://www.saucedemo.com/`)
- `REQRES_BASE_URL` (default: `https://reqres.in/`)

## Run tests

```powershell
# all projects
npm test

# UI (saucedemo-ui)
npm run test:ui:run

# API (reqres-api)
npm run test:api

# interactive UI mode / report
npm run test:ui
npm run test:report
```

PowerShell overrides:

```powershell
$env:SAUCEDEMO_BASE_URL = 'https://www.saucedemo.com/'
$env:REQRES_BASE_URL = 'https://reqres.in/'
npm test
```

In GitHub Actions, repository variables `SAUCEDEMO_BASE_URL` and `REQRES_BASE_URL` can be used to override defaults (also passed as `BASE_URL`/`API_BASE_URL` for compatibility).

## Notes

- Seed specs provide baseline checks; additional scenarios/specs may be placeholders pending further implementation.
- Reqres classic demo endpoints may be rate-limited and demo writes are not persisted; API tests should assert response contracts rather than durable mutations.
- See [domain/saucedemo/ui-rules.md](domain/saucedemo/ui-rules.md), [domain/reqres/api-rules.md](domain/reqres/api-rules.md), and the files under [specs/](specs/) for rules, strategy, and scenarios.
