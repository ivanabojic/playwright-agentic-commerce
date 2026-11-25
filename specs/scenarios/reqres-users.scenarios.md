# Reqres Users Scenarios

## Preconditions / notes
- Base URL: `REQRES_BASE_URL` (default `https://reqres.in/`).
- Classic demo endpoints may be keyless/rate-limited and can include additive fields like `_support`/`_meta`.
- Demo write operations are not persisted; scenarios focus on response contracts.

## Scenario: List users with pagination
**Given** the Reqres API is available  
**When** a client requests `GET /api/users?page=2`  
**Then** the response status is 200  
**And** the body contains pagination fields (`page`, `per_page`, `total`, `total_pages`) and a `data` array  
**And** each user in `data` includes key fields such as `id`, `email`, `first_name`, `last_name`, and `avatar`

## Scenario: Retrieve a single user by ID
**Given** a known user ID exists (e.g. `2`)  
**When** a client requests `GET /api/users/2`  
**Then** the response status is 200  
**And** the body contains a `data` object for the requested user

## Scenario: Single user not found
**Given** a user ID does not exist (e.g. `23`)  
**When** a client requests `GET /api/users/23`  
**Then** the response status is 404  
**And** the response body matches the classic empty-object behavior (or documented not-found shape)

## Scenario: Successful login returns a token
**Given** valid demo login credentials (e.g. `eve.holt@reqres.in` / `cityslicka`)  
**When** a client sends `POST /api/login` with the credentials  
**Then** the response status is 200  
**And** the body contains a `token`

## Scenario: Login fails without password
**Given** a login request missing a required field (e.g. password)  
**When** a client sends `POST /api/login`  
**Then** the response status is 400  
**And** the body contains an error message

## Scenario: Demo create/update/delete user responses
**Given** the Reqres API is available  
**When** a client sends `POST /api/users`, `PUT|PATCH /api/users/{id}`, or `DELETE /api/users/{id}`  
**Then** the API returns the expected demo status/response shape for the operation  
**And** the test does not assume the change is persisted on subsequent reads
