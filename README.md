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

- Internet access to SauceDemo and Reqres (or reachable deployments)
- To run in Docker: Docker Desktop or Docker Engine with Docker Compose v2
- To run locally: Node.js and npm

## Run tests in Docker

From the repository root, run:

```sh
docker compose run --build --rm tests
```

This builds the Playwright environment, installs project dependencies inside the image, and runs all UI and API tests. Node.js, npm, and browser dependencies do not need to be installed on the host. Test results and the HTML report are written to `test-results/` and `playwright-report/`.

Docker Compose reads `.env` from the repository root, so optional base URL overrides can be set there:

```dotenv
SAUCEDEMO_BASE_URL=https://www.saucedemo.com/
REQRES_BASE_URL=https://reqres.in/
```

The container image uses the Playwright version pinned by `package-lock.json`; update the image tag in `Dockerfile` when upgrading Playwright.

## Run tests locally

Install Node.js and npm, then run:

```sh
npm install
npx playwright install chromium
```

Environment variables (CI or your shell):
- `SAUCEDEMO_BASE_URL` (default: `https://www.saucedemo.com/`)
- `REQRES_BASE_URL` (default: `https://reqres.in/`)

## Run tests

```sh
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

For local runs, set base URL overrides in your shell:

```sh
# Bash
SAUCEDEMO_BASE_URL=https://www.saucedemo.com/ REQRES_BASE_URL=https://reqres.in/ npm test
```

```powershell
# PowerShell
$env:SAUCEDEMO_BASE_URL = 'https://www.saucedemo.com/'
$env:REQRES_BASE_URL = 'https://reqres.in/'
npm test
```

In GitHub Actions, repository variables `SAUCEDEMO_BASE_URL` and `REQRES_BASE_URL` can be used to override defaults (also passed as `BASE_URL`/`API_BASE_URL` for compatibility).

## Notes

- Seed specs provide baseline checks; additional scenarios/specs may be placeholders pending further implementation.
- Reqres classic demo endpoints may be rate-limited and demo writes are not persisted; API tests should assert response contracts rather than durable mutations.
- See [domain/saucedemo/ui-rules.md](domain/saucedemo/ui-rules.md), [domain/reqres/api-rules.md](domain/reqres/api-rules.md), and the files under [specs/](specs/) for rules, strategy, and scenarios.
