# Eco-Grid — Smart Energy Optimization Platform

A full-stack energy management platform for households and SMEs: monitor electricity
usage, manage devices, receive AI-powered optimization recommendations, and track
cost savings and CO₂ impact.

![Node](https://img.shields.io/badge/Node.js-20-339933)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Express](https://img.shields.io/badge/Express-4-000000)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248)
![License](https://img.shields.io/badge/License-MIT-green)

**Live demo:** https://eco-grid.onrender.com
**API:** https://eco-grid-api.onrender.com/api · Health: `/api/health`

---

## Overview

Eco-Grid helps users understand and reduce their energy consumption. Users register,
connect their devices, and get a live dashboard of usage, costs, and carbon footprint.
An AI optimizer (Claude, behind a provider-adapter layer) turns usage data into
concrete, personalized saving actions. Larger modules extend the platform to
virtual power plants (VPP), multi-tenant energy hubs, pilots, pricing/subscriptions,
and a content system (blog, testimonials, case studies, FAQ, roadmap).

## Features

- **Dashboard** — daily/monthly consumption, cost, and CO₂ visualizations
- **Device Hub** — register devices and estimate their consumption
- **AI Optimizer** — personalized energy-saving recommendations (Claude adapter)
- **Reports & ESG metrics** — monthly savings and emissions reporting
- **Virtual Power Plant (VPP)** — pools, markets, dispatch, and revenue views
- **Energy Hubs** — multi-tenant hubs with policies, tenants, and analytics
- **Pricing & subscriptions** — plan catalog with feature gating and upgrade flow
- **Content platform** — articles, testimonials, case studies, pilots, FAQ, roadmap
- **Authentication & authorization** — JWT sessions with role-based access control
- **Internationalization** — English, Farsi (RTL), and French (`apps/web/public/locales`)

## Architecture

npm-workspaces monorepo:

```
eco-grid/
├── apps/
│   ├── web/          # React 18 + Vite + Tailwind CSS frontend
│   └── api/          # Express + MongoDB (Mongoose) REST API
└── packages/
    ├── ai/           # AI provider adapters (Claude) and prompts
    ├── ui/           # Shared UI components
    ├── lib/          # Shared utilities
    └── config/       # Shared configuration
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the system design and
[docs/SECURITY.md](docs/SECURITY.md) for the authentication/authorization model.

## Getting started

### Prerequisites

- Node.js 20+
- A MongoDB connection string (e.g. MongoDB Atlas)

### Install

```bash
npm install
```

### Configure environment

Copy the examples and fill in real values (never commit real secrets):

```bash
cp apps/api/.env.example apps/api/.env   # MONGODB_URI, JWT_SECRET, AI keys…
cp apps/web/.env.example apps/web/.env   # VITE_API_URL
```

### Run (development)

```bash
npm run dev        # web (Vite) + api (Express) together
```

- Web: http://localhost:5173
- API: http://localhost:5000/api · health check at `/api/health`

### Build

```bash
npm run build --workspace=apps/web
```

## API overview

| Area | Base path | Access |
|---|---|---|
| Health | `GET /api/health` | Public |
| Auth | `/api/auth` | Public (register/login), token for session |
| Dashboard / Devices / Optimizer / Reports | `/api/dashboard`, `/api/devices`, `/api/optimizer`, `/api/reports` | Authenticated |
| VPP / Hubs | `/api/vpp`, `/api/hub` | Authenticated |
| Pricing / Subscriptions | `/api/pricing`, `/api/subscriptions` | Mixed |
| Content | `/api/articles`, `/api/testimonials`, `/api/case-studies`, `/api/pilots`, `/api/faq`, `/api/roadmap` | Public reads, admin/editor writes |
| Admin | `/api/faq/admin`, `/api/ai-writer` | Admin (editor where noted) |
| System | `/api/metrics`, `/api/system` | Authenticated |

Full route inventory: `GET /api` on a running server.

## Security

- Passwords hashed with **bcrypt**; JWTs signed with a server-only secret that
  **fails fast at startup if missing**
- `authenticate` (401) and role-based `authorize` (403) middleware — see
  [docs/SECURITY.md](docs/SECURITY.md)
- Helmet headers, CORS allow-list, per-route rate limiting, Zod validation
- Secrets live only in `.env` / deployment environment variables

## Deployment

Deployed on **Render** (web service + API service) with MongoDB Atlas.
Environment variables are configured in the Render dashboard; the API loads
`apps/api/.env` locally and platform variables in production.

## Roadmap

- Real smart-meter integrations (OCPP / Modbus / SunSpec)
- Carbon-credit wallet and rewards
- Background jobs for automated reports
- React Native mobile app

## Author

**Saeed Sharifzadeh** — Software Development Bootcamp capstone project,
submitted October 21, 2025 (Vancouver, BC).

## License

[MIT](LICENSE)
