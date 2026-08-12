# Next.js Starter Kit — EPFL SI

A production-ready Next.js starter for EPFL applications, with Microsoft Entra ID authentication, internationalization (FR/EN), and Docker deployment.

## Features

- **Authentication** — SSO via Microsoft Entra ID (Auth.js v5), JWT sessions with automatic token refresh. User profile enriched from the EPFL userinfo API (`groups`, `accreds`).
- **Internationalization** — French and English with [next-intl](https://next-intl-docs.vercel.app/), cookie-based locale persistence.
- **UI** — Tailwind CSS v4, shadcn/ui components, Suisse Intl typeface.
- **Code quality** — [Biome](https://biomejs.dev/) for linting and formatting.
- **Docker** — Multi-stage Bun + Node.js Dockerfile with standalone Next.js output.
- **CI/CD** — GitHub Actions: lint check, Docker build & push to GHCR, automatic GitHub Release on version bump.

## Requirements

- [Bun](https://bun.sh/) ≥ 1.2
- A Microsoft Entra ID app registration with the following redirect URI: `http://localhost:3000/api/auth/callback/microsoft-entra-id`

## Getting Started

```bash
bun install
cp .env.example .env.local
# fill in .env.local
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `AUTH_SECRET` | Random secret for Auth.js session encryption (`openssl rand -base64 32`) |
| `ENTRA_ID` | EntraID application (client) ID |
| `ENTRA_SECRET` | EntraID client secret |
| `ENTRA_ISSUER` | `https://login.microsoftonline.com/<tenant-id>/v2.0` |

## Scripts

| Command | Description |
|---|---|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun start` | Start production server |
| `bun lint` | Run Biome checks |
| `bun format` | Auto-format with Biome |

## Project Structure

```
src/
├── app/
│   ├── (root)/           # Pages with header + footer
│   │   ├── page.tsx      # Home page
│   │   └── dashboard/    # Protected dashboard (groups, accreds, raw session)
│   ├── api/auth/         # Auth.js route handlers
│   ├── error.tsx         # Global error boundary
│   └── not-found.tsx     # 404 page
├── components/
│   ├── header.tsx        # Navigation bar
│   ├── footer.tsx        # EPFL footer
│   └── ui/               # shadcn/ui components
├── constants/
│   ├── i18n.ts           # Supported locales
│   └── routes.ts         # Protected route patterns
├── messages/
│   ├── en.json           # English translations
│   └── fr.json           # French translations
├── services/
│   ├── auth.ts           # Auth.js + EPFL userinfo integration
│   └── locale.ts         # Cookie-based locale management
├── types/
│   └── next-auth.d.ts    # NextAuth type extensions
├── i18n.ts               # next-intl request config
└── proxy.ts              # Middleware for protected routes
```

## Protected Routes

Routes defined in `src/constants/routes.ts` redirect unauthenticated users to the sign-in page. Currently `/dashboard` and all sub-paths are protected.

To add a new protected route:

```ts
// src/constants/routes.ts
export const PROTECTED_ROUTES = {
  DASHBOARD: { path: /^\/dashboard(\/.*)?$/ },
  MY_ROUTE:  { path: /^\/my-route(\/.*)?$/ },
};
```

## Adding UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/). Add components with:

```bash
bunx shadcn add <component>
```

## Docker

```bash
docker build -t next-starterkit .
docker run -p 3000:3000 --env-file .env.local next-starterkit
```

## CI/CD

The GitHub Actions workflow (`.github/workflows/build.yml`) runs on every push to `main`:

1. **Code Quality** — Biome lint check, uploads report as artifact.
2. **Detect Version** — Reads `version` from `package.json`; skips build if a release with that version already exists.
3. **Build and Push** — Builds the Docker image and pushes to GHCR (`ghcr.io/<owner>/<repo>`).
4. **Create Release** — Creates a GitHub Release with auto-generated notes from conventional commit messages.

To trigger a new release, bump the version in `package.json` and push to `main`.
