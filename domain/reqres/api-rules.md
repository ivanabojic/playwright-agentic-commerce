# Reqres API Rules

Base URL: `https://reqres.in/` (override with `REQRES_BASE_URL` / `API_BASE_URL`). See [Reqres docs](https://reqres.in/docs).
Aligned with: *ReqRes API Requirements – QA Automation Reference* (REQ-IDs in brackets). Where the two differ, the requirements doc wins; confirm fixture values against a live response before logging a defect.

> **Path convention:** the base URL has no `/api`; every path below includes it (e.g. `/api/users`). The requirements doc writes base `https://reqres.in/api` with paths like `/users`. Same URLs, but never combine the two styles (`/api/api/users`).

Scope: `/api/users`, `/api/unknown`, `/api/register`, `/api/login`, and the `page`, `per_page`, `delay` query options. Out of scope: project collections (`/api/collections/*`), app users, and the `/agent/v1/*` sandbox.

## Authentication header
- The key is **optional** for classic endpoints. Verified on the live site, Nov 23, 2026, with `POST /api/users`:

| Key sent | Status | Notes |
|---|---|---|
| None | 201 | Runs on the shared demo quota (low daily limit); the response adds extra info about that limit |
| Valid personal key | 201 | Runs on your own quota of 250 requests/day |
| Invalid or revoked key | 403 | `error = "invalid_api_key"`; no fallback to the shared quota |

- The no-key response carries the same contract as the keyed one plus the low-limit notice. Treat that notice as an additive field: don't fail on it, and don't assert on its wording.
- Send a personal key on every request in CI so the suite doesn't share the demo quota with everyone else. [REQ-GEN-01]
- Store the key as `REQRES_API_KEY` in CI secrets and set it once as a default header (e.g. Playwright `extraHTTPHeaders`). If the variable is unset (e.g. a quick local run), send no header and expect the shared demo limits.
- A missing key is **not** rejected; this replaces REQ-GEN-02's expected 401.
- An **invalid or revoked** key is rejected with an error and does **not** fall back to the shared demo quota (verified Nov 23, 2026, with `POST /api/users`). The key is checked before the path: misspelled paths (`/api/usr`, `/api/usres`) return the same key error, so a key failure can hide a wrong URL. Assert:
  - `error = "invalid_api_key"`
  - `message`, `hint` and `docs_url` are non-empty strings
  - `next_steps` is a non-empty array
  - an additive `_meta` block may be present; treat it as additive (see General contract)
  - the status code is **403 Forbidden** (verified Nov 23, 2026; not the 401 that REQ-GEN-02 expected)
- Because a bad key fails loudly instead of degrading silently, a broken `REQRES_API_KEY` secret will show up as failing tests rather than as hidden quota use.

## General contract
- Request bodies send `Content-Type: application/json`. Responses are JSON (`Content-Type` contains `application/json`), except 204. [REQ-GEN-03, 04]
- Status codes follow HTTP semantics [REQ-GEN-05]:

| Code | Meaning |
|---|---|
| 200 | Read or update succeeded |
| 201 | Create succeeded |
| 204 | Delete succeeded (empty body) |
| 400 | Bad input |
| 403 | Invalid or revoked API key (`invalid_api_key`); a missing key is not rejected |
| 404 | Unknown id (empty body `{}`) |
| 429 | Rate limit exceeded |

- Reads always use a `data` envelope: an **array** for lists, an **object** for single items. [REQ-GEN-06]
- Reads include a `support` block with non-empty `support.url` and `support.text` strings. [REQ-GEN-07]
- Additive fields (e.g. `_meta`, new keys under `support`) are allowed: log them as warnings, don't fail the test. [REQ-NFR-05]

## Pagination
- List responses include `page`, `per_page`, `total`, `total_pages` (integers) and a `data` array. [REQ-GEN-08]
- `total_pages = ceil(total / per_page)` and `data` length ≤ `per_page`. [REQ-GEN-09]
- A page past the end returns 200 with `data: []` and the requested `page` echoed. [REQ-GEN-10]
- `?per_page=12` returns up to 12 items with `per_page = 12`. [REQ-GEN-11]
- `?delay=N` delays the response by at least N seconds (and under N + 2 s); the body is otherwise unchanged. [REQ-USR-13, REQ-NFR-02]

## Users (`/api/users`)
Reference data: 12 fixed users, 6 per page by default (2 pages). User 2 is Janet Weaver, `janet.weaver@reqres.in`.

**Reads**
- `GET /api/users?page=2` → 200; `page = 2`, `per_page = 6`, `total = 12`, `total_pages = 2`; six users with ids 7–12. [REQ-USR-01]
- `GET /api/users` (no page) → defaults to page 1, ids 1–6. [REQ-USR-02]
- Each user has `id` (integer), `email` (valid email), `first_name` and `last_name` (strings), `avatar` (image URL). [REQ-USR-03]
- User ids are unique within and across pages. [REQ-USR-04]
- `GET /api/users/2` → 200; `data.id = 2`, `first_name = "Janet"`, `last_name = "Weaver"`. [REQ-USR-05]
- `GET /api/users/23` → 404 with empty body `{}`. [REQ-USR-06]

**Writes**
- `POST /api/users` with `{"name":"morpheus","job":"leader"}` → 201; echoes `name` and `job`, adds `id` (string) and `createdAt` (ISO-8601). [REQ-USR-07]
- `PUT /api/users/2` with `{"name":"morpheus","job":"zion resident"}` → 200; echoes the body, adds `updatedAt`. [REQ-USR-08]
- `PATCH /api/users/2` with a partial body → 200; echoes the sent fields, adds `updatedAt`. [REQ-USR-09]
- `DELETE /api/users/2` → 204 with an empty body. [REQ-USR-10]
- `createdAt` / `updatedAt` are within 60 s of the request time (UTC). Never hard-code timestamps or generated ids. [REQ-USR-11]

**Persistence**
- Writes are **not persisted**: `GET /api/users/2` after PUT or DELETE still returns the original Janet Weaver. Never chain tests on write results. [REQ-USR-12]
- Tests that need real persistence would use Reqres project collections, which are out of scope; this repo's default API tests target the classic endpoints.
- **Open question:** POST accepts arbitrary bodies without validation. Decide with the team whether an empty or malformed body returning 201 is accepted behavior.

## Resources (`/api/unknown`)
Reference data: 12 fixed color records, paginated like users.

- `GET /api/unknown` → 200; paginated list per the Pagination rules, `total = 12`. [REQ-RES-01]
- Each resource has `id` (integer), `name` (string), `year` (4-digit integer), `color` (hex matching `^#[0-9A-Fa-f]{6}$`), `pantone_value` (string like `15-4020`). [REQ-RES-02]
- `GET /api/unknown/2` → 200; `data.id = 2`, `name = "fuchsia rose"`, `year = 2001`, `color = "#C74375"`. [REQ-RES-03]
- `GET /api/unknown/23` → 404 with empty body `{}`. [REQ-RES-04]
- Resources are ordered by ascending id on every page. [REQ-RES-05]

## Register and login (`/api/register`, `/api/login`)
Only predefined fixture users succeed. Test accounts:
- Register: `eve.holt@reqres.in` / `pistol`
- Login: `eve.holt@reqres.in` / `cityslicka`

| Request | Expected | ID |
|---|---|---|
| `POST /api/register` with the defined account | 200; `id = 4` and a non-empty `token` | REQ-AUTH-01 |
| `POST /api/register` without password | 400; `{"error":"Missing password"}` | REQ-AUTH-02 |
| `POST /api/register` without email | 400; `{"error":"Missing email or username"}` | REQ-AUTH-03 |
| `POST /api/register` with an undefined email | 400; error says only defined users succeed registration | REQ-AUTH-04 |
| `POST /api/login` with the defined account | 200; non-empty `token` | REQ-AUTH-05 |
| `POST /api/login` without password | 400; `{"error":"Missing password"}` | REQ-AUTH-06 |
| `POST /api/login` without email | 400; `{"error":"Missing email or username"}` | REQ-AUTH-07 |
| `POST /api/login` with an unknown email | 400; `{"error":"user not found"}` | REQ-AUTH-08 |

- Register and login return the same token for the same user. [REQ-AUTH-09]
- Error bodies contain only `error`: no `token` or `id` on a 400. [REQ-AUTH-10]
- The token is a demo value. No endpoint requires it, so never write tests that expect it to authorize later calls.

## Non-functional
- Response time: p95 under 1,500 ms from the CI runner, without `delay` (team-set threshold; tune after a baseline run). [REQ-NFR-01]
- Daily cap: 250 requests per day with a personal key (confirmed Nov 23, 2026); without a key, the shared demo quota is lower. Exceeding the cap returns 429 until reset. [REQ-NFR-03]
- On 429, honor `Retry-After` when present. [REQ-NFR-04]
- All calls use `https://` with a valid TLS certificate. [REQ-NFR-06]

## Automation guidance
- **Traceability:** tag every test with its requirement ID, e.g. `@REQ-USR-07 create user returns 201`. A requirement with no test is a coverage gap.
- **Priorities:** P1 (core contract: status code and key fields) runs on every commit; P2 (full schema, validation, errors) nightly; P3 (edge, performance, content) weekly.
- **Schemas:** keep one JSON Schema per response shape — user list, single user, resource list, single resource, create, update, auth success, auth error — and validate every response.
- **Test data:** keep fixture values (user 2, resource 2, test accounts) in one data file, not in tests.
- **Independence:** keep tests independent and idempotent; never rely on state from another test's writes.
- **Retries:** retry only on 429 or 5xx, with backoff. Never retry 4xx failures, including 403 `invalid_api_key`: fix the key instead.
- **Request budget:** keep the P1 smoke suite to about 15 calls and count calls against the daily cap.
- **Coverage order:** REQ-GEN-01/05/06/08 and every P1 row first → error and schema cases (P2) → pagination edges, delay, performance, and persistence checks (P3).

## Open questions
- Is an empty or malformed POST body returning 201 accepted behavior? [REQ-USR-07]

**Resolved (Nov 23, 2026):**
- `POST /api/users` returns 201 with no key (shared demo quota, plus a low-limit notice) and 201 with a valid key (250 requests/day). [REQ-GEN-02, REQ-NFR-03]
- An invalid key is rejected with **403** and `error = "invalid_api_key"` on `POST /api/users`; it does not fall back to the shared quota, and it's checked before the path. [REQ-GEN-02]
