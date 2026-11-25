---
applyTo:
  - tests/api/**
  - src/api/**
  - domain/reqres/**
  - specs/**/*reqres*
---

# Reqres API Instructions

Scope: Reqres REST API automation (`tests/api/**`, `src/api/**`).

## Domain and environment
- Default base URL: `https://reqres.in/` (`REQRES_BASE_URL` / `API_BASE_URL` override).
- Common classic endpoints: `/api/users`, `/api/users/{id}`, `/api/login`, `/api/register`, `/api/unknown` (resources), etc.
- Follow [domain/reqres/api-rules.md](../../domain/reqres/api-rules.md) and [domain/reqres/endpoints-schema.md](../../domain/reqres/endpoints-schema.md).

## Behavior and constraints
- Classic demo endpoints can be used without an API key but may be rate-limited and may include metadata fields (e.g. `_meta`, `support`) in responses.
- Demo write operations (POST/PUT/PATCH/DELETE on classic endpoints) typically echo/simulate results and are not persisted. Do not chain tests assuming durable mutations unless using a configured persistent Reqres project/key flow.
- Validate status codes, required fields, and response shapes; allow for additive metadata fields.
- Use documented demo credentials/payloads for login/register checks (e.g. `eve.holt@reqres.in` patterns as applicable).

## Implementation rules
- Use API clients in `src/api/clients` and models/schemas in `src/api/models`.
- Keep tests isolated and independent; do not rely on execution order.
- Use environment/configured base URLs and shared request helpers instead of duplicating URL/auth logic.
- Prefer deterministic read validations (known IDs/pages, pagination fields, schema/field assertions).
