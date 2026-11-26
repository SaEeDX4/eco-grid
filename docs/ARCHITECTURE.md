# Eco-Grid — Architecture

## System overview

Eco-Grid is an npm-workspaces monorepo with a React SPA, an Express REST API,
and shared packages. The API is the only component that talks to MongoDB and to
external AI providers; the browser never holds provider keys.

```
Browser (React SPA)
   │  HTTPS, Bearer JWT
   ▼
Express API (apps/api)
   ├── routes/        one router per domain area (auth, devices, vpp, hub, …)
   ├── controllers/   request handling
   ├── services/      business logic (metrics, AI, hub dispatch/policy, …)
   ├── models/        Mongoose schemas
   └── middleware/    authenticate / authorize, rate limiting, validation
   │
   ├── MongoDB (Mongoose)          — users, devices, content, VPP/hub data
   └── packages/ai (Claude adapter) — optimization + AI writing features
```

## Frontend (`apps/web`)

- React 18 + Vite, React Router, Tailwind CSS, Recharts, Mapbox GL
- API base URL from `VITE_API_URL` / `VITE_API_BASE` environment variables
- i18n JSON locales in `public/locales` (en, fa with RTL, fr)
- Pages mirror the API domains: dashboard, devices, optimizer, reports,
  VPP, hubs, pricing, pilots, blog, FAQ, roadmap

## Backend (`apps/api`)

- Express 4, ES modules, layered as routes → controllers → services → models
- `src/server.js` wires middleware (Helmet, CORS allow-list, JSON parsing),
  mounts all routers under `/api/*`, and installs a 404 handler and a global
  error handler (stack traces only in development)
- Background metrics collection starts once the MongoDB connection opens
- Seed scripts in `src/scripts/` populate demo/content data
  (`npm run seed:all` and per-domain variants in `apps/api/package.json`)

## Shared packages (`packages/`)

| Package | Purpose |
|---|---|
| `packages/ai` | Provider-agnostic AI adapters (Claude) and prompt templates |
| `packages/ui` | Shared React components |
| `packages/lib` | Shared utilities |
| `packages/config` | Shared configuration |

## Data model (high level)

Core Mongoose models: `User` (with `role`), devices, articles, case studies,
testimonials, pilots, FAQs, roadmap items, subscriptions, and the VPP/Hub
families (pools, markets, hubs, tenants, policies, dispatch records).

## Deployment

Render hosts the web and API services; MongoDB Atlas holds the data.
The API resolves its `.env` path relative to `src/server.js`, so it starts
identically from the repo root, the workspace folder, or Render.
