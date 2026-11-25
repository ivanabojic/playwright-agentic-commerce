# Reqres Endpoints and Schema (Classic)

Base URL: `https://reqres.in/`

> Classic demo endpoints may include additive fields such as `support` and `_meta`. Confirm exact schemas against [Reqres docs](https://reqres.in/docs) and live responses.

## Users

### `GET /api/users?page={n}`
**Response (typical)**
```json
{
  "page": 2,
  "per_page": 6,
  "total": 12,
  "total_pages": 2,
  "data": [
    { "id": 7, "email": "michael.lawson@reqres.in", "first_name": "Michael", "last_name": "Lawson", "avatar": "https://reqres.in/img/faces/7-image.jpg" }
  ],
  "support": { "url": "...", "text": "..." }
}
```

### `GET /api/users/{id}`
**Response (typical)**
```json
{
  "data": { "id": 2, "email": "janet.weaver@reqres.in", "first_name": "Janet", "last_name": "Weaver", "avatar": "https://reqres.in/img/faces/2-image.jpg" },
  "support": { "url": "...", "text": "..." }
}
```
- Unknown IDs return `404` with an empty object `{}` (classic behavior).

### `POST /api/users` (demo create, not persisted)
**Request**: `{ "name": "morpheus", "job": "leader" }`  
**Response (typical)**: `{ "name": "morpheus", "job": "leader", "id": "123", "createdAt": "..." }`

### `PUT|PATCH /api/users/{id}` (demo update, not persisted)
**Response (typical)**: submitted fields plus `updatedAt`.

### `DELETE /api/users/{id}` (demo delete, not persisted)
**Response (typical)**: `204 No Content`.

## Authentication

### `POST /api/login`
**Request**: `{ "email": "eve.holt@reqres.in", "password": "cityslicka" }`  
**Response (success)**: `{ "token": "..." }`  
**Response (failure)**: `400` with `{ "error": "..." }` (e.g. missing password).

### `POST /api/register`
**Request**: `{ "email": "eve.holt@reqres.in", "password": "pistol" }`  
**Response (success)**: `{ "id": 4, "token": "..." }`  
**Response (failure)**: `400` with `{ "error": "..." }`.

## Resources (`/api/unknown`)

### `GET /api/unknown`
List endpoint with pagination and `data` array of resources (fields typically include `id`, `name`, `year`, `color`, `pantone_value`).

### `GET /api/unknown/{id}`
Returns `{ "data": { ...resource }, "support": { ... } }` or `404 {}` for unknown IDs.

## Notes
- Classic endpoints may include rate-limit/demo metadata (`_meta`) and are not guaranteed to persist writes.
- Status codes and core fields are the primary contract for tests; treat extra fields as additive.