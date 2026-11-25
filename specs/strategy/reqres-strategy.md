# Reqres API Test Strategy

## Scope
Automate Reqres classic REST API checks in `tests/api/` using Playwright (`reqres-api` project).
- In scope: user and resource listing/detail, pagination, login/register contracts, and demo create/update/delete responses.
- Out of scope: persistence guarantees for classic demo writes and project/key-managed collection workflows unless explicitly configured.

## Risks
- **Demo/non-persisted writes**: classic POST/PUT/PATCH/DELETE operations echo results but do not persist; do not chain dependent state.
- **Rate limits / keyless demo behavior**: responses may include `_meta`/`support` fields and availability may be constrained under shared limits.
- **Pagination/contracts**: list responses must be validated for pagination fields and `data` shapes.
- **Auth/error handling**: login/register success and failure paths return different status codes and payloads.

## Coverage matrix (initial)

| Risk / Area | Coverage | Scenario / Spec |
|---|---|---|
| API reachability / users list | Seed | `tests/api/reqres.seed.spec.js` |
| Users pagination & detail | Planned | `tests/api/users.spec.js`, scenarios |
| Login/register success & failure | Planned | auth specs/scenarios |
| Resources (`/api/unknown`) | Planned | resource specs |
| Demo create/update/delete responses | Planned/guarded | contract checks only |

## Test data and environment
- Base URL: `REQRES_BASE_URL` (default `https://reqres.in/`).
- Use domain rules/schemas in `domain/reqres/api-rules.md` and `domain/reqres/endpoints-schema.md`.
- Keep tests independent and idempotent; validate status codes and key fields/schemas while allowing additive metadata fields.
