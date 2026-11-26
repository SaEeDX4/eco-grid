# Eco-Grid — Security & Authorization Design

## Authentication (JWT)

- Login/register issue a **JSON Web Token** signed with `JWT_SECRET`
  (`apps/api/src/utils/jwt.js`, default expiry **7 days**).
- The secret is read only from the server environment. The JWT helper
  **fails fast at startup** if `JWT_SECRET` is missing — the API never runs
  with an implicit or default secret.
- Clients send the token as `Authorization: Bearer <token>`.
- Passwords are stored as **bcrypt** hashes, never in plain text, and the
  password field is excluded from query results (`select("-password")`).

## Authorization boundaries

Two middleware layers in `apps/api/src/middleware/auth.js` guard every
protected route:

1. **`authenticate`** — verifies the Bearer token, then re-loads the user
   from MongoDB. A token for a deleted/non-existent user is rejected.
   Failures return **401** (`No token provided` / `User not found` /
   `Invalid or expired token`).
2. **`authorize(...roles)`** — role-based access control. Runs after
   `authenticate`; returns **403 Forbidden** when the user's role is not in
   the allowed set. Accepts `authorize("admin")` and
   `authorize(["admin", "editor"])` forms.

| Boundary | Examples |
|---|---|
| Public | `GET /api/health`, content reads (articles, FAQ, testimonials, roadmap), pricing catalog |
| Authenticated user | Dashboard, devices, optimizer, reports, VPP, hubs, chat |
| Editor or admin | Creating/updating articles and AI-writer features |
| Admin only | FAQ admin (`/api/faq/admin`), case-study and pilot management, deletes, stats endpoints |

Routers apply the boundary at the router level where the whole area shares
one policy (e.g. `faqAdmin.js` applies `authenticate` + `authorize(["admin"])`
to every route) and per-route where reads and writes differ (e.g. articles).

## Platform protections

- **Helmet** sets secure HTTP headers on all API responses.
- **CORS** is an explicit allow-list of origins (local dev + production
  frontend); unknown origins are rejected, with `credentials` support only
  for allow-listed origins.
- **Rate limiting** (`express-rate-limit`) protects sensitive routes such as
  chat and the contact form (`apps/api/src/middleware/rateLimiter.js`).
- **Input validation** with Zod on request payloads.
- **Error handling** returns stack traces only when
  `NODE_ENV=development`; production responses carry the message only.

## Secrets management

- All secrets (`MONGODB_URI`, `JWT_SECRET`, AI provider keys, OAuth and maps
  keys) come from environment variables — see `apps/api/.env.example` for
  the full list with placeholder values.
- `.env` files are git-ignored; only `.env.example` files are committed.
- Frontend `VITE_*` variables are public by design and contain no secrets
  (only the API base URL).
- AI provider keys are used **server-side only**, through the adapter in
  `packages/ai` / `apps/api/src/services/`; they are never shipped to the
  browser.

## Known limitations / honest notes

- Tokens are stateless: a JWT stays valid until expiry (7 days) even after
  a password change. Shorter-lived access tokens + refresh-token rotation
  are the planned hardening step.
- Authorization is role-based only (no per-resource ownership checks beyond
  the authenticated-user scoping in controllers).
