# Copilot Instructions

This repository contains Playwright automation for two demo systems:
- **SauceDemo UI**: browser-based storefront flows against `https://www.saucedemo.com/` (or `SAUCEDEMO_BASE_URL`).
- **Reqres API**: REST API checks against `https://reqres.in/` (or `REQRES_BASE_URL`).

## Routing

- For UI/storefront work (selectors, page objects, cart/checkout behavior, browser exploration), use SauceDemo guidance:
  - [instructions/saucedemo-ui.instructions.md](instructions/saucedemo-ui.instructions.md)
  - [../domain/saucedemo/ui-rules.md](../domain/saucedemo/ui-rules.md)
  - [../domain/saucedemo/test-data.md](../domain/saucedemo/test-data.md)
- For API work (auth, endpoints, payloads, schemas, demo behavior), use Reqres guidance:
  - [instructions/reqres-api.instructions.md](instructions/reqres-api.instructions.md)
  - [../domain/reqres/api-rules.md](../domain/reqres/api-rules.md)
  - [../domain/reqres/endpoints-schema.md](../domain/reqres/endpoints-schema.md)

## Project conventions

- Keep SauceDemo UI tests and helpers under `tests/ui/` and `src/ui/`.
- Keep Reqres API tests and clients under `tests/api/` and `src/api/`.
- Prefer Page Object Model/components for UI and typed API clients/models for API tests.
- Use environment variables from `.env`/CI (`SAUCEDEMO_BASE_URL`, `REQRES_BASE_URL`) instead of hardcoded URLs.
- Reuse fixtures and domain rules; do not invent user, inventory, cart, or API behavior not supported by the demo apps.
- When adding or refactoring tests, preserve existing behavior and keep assertions focused and deterministic.

## Agent artifacts

- Strategy and scenarios live in `specs/strategy/` and `specs/scenarios/`.
- Saved test reviews (when explicitly requested) live in `specs/reviews/`.
- Custom agent definitions live in `.github/agents/`.
- Use `.vscode/mcp.json` for Playwright MCP/browser exploration of the live SauceDemo site when needed.
