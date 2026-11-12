# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Auktiva is a self-hostable auction platform (no payment processing — settlement happens offline). Next.js 16 **Pages Router**, React 19, Prisma 7 on SQLite/Turso, NextAuth v4, Tailwind 4 + DaisyUI 5, next-intl. Node version is pinned in `.nvmrc` (22.x; engines require >=20).

## Commands

```bash
npm run dev               # Next dev server (SWR polling only, no websockets)
npm run dev:realtime      # Next dev + Soketi via Docker on :6001
npm run build             # prisma generate && next build
npm run lint              # eslint (next core-web-vitals + typescript)
npm run format            # prettier --write . (double quotes, trailing commas, width 80)
npx tsc --noEmit          # typecheck (no script for this)

npm run db:push           # apply schema to local SQLite
npm run db:migrate        # create + apply a migration (local SQLite only)
npm run db:migrate:turso  # apply migrations to a Turso DB
npm run db:generate       # regenerate client into src/generated/prisma
npm run seed:currencies   # required on a fresh DB
npm run seed:test-db      # faker test data
npm run setup             # interactive setup wizard (cli/setup.ts)
```

### Tests

There is no `test` script and no test framework dependency. The few tests (`*.test.ts`, colocated with source) use `node:test` + `node:assert/strict` and are run with tsx:

```bash
npx tsx --test src/lib/services/auction-currency-rule.service.test.ts
npx tsx --test $(git ls-files '*.test.ts')
```

## Architecture

### API layer: page route → middleware → handler → service

API routes in `src/pages/api/**` are thin wiring only. They call `createHandler` (`src/lib/api/create-handler.ts`) with a per-method config of `handler` or `[[...middleware], handler]`:

```ts
export default createHandler({
  GET: [[withAuth, requireOwner], auctionHandlers.getAuction],
  PATCH: [[withAuth, requireOwner, withValidation(updateAuctionSchema)], auctionHandlers.updateAuction],
});
```

- **Middleware** (`src/lib/api/middleware/`): `withAuth` (session → `ctx`), `withMembership`/`requireMembership`/`requireAdmin`/`requireOwner` (role checks against `AuctionMember`, keyed off the `id` route param), `withValidation(zodSchema)`, and rate limiters (`withBidRateLimit`, etc.). Middleware enriches the shared `ApiContext` (`ctx.params` holds flattened query params).
- **Handlers** (`src/lib/api/handlers/*.handlers.ts`): define the zod schemas and request/response logic; exported as namespaces (`auctionHandlers`, `bidHandlers`, …) from `@/lib/api`.
- **Services** (`src/lib/services/*.service.ts`): Prisma access and business logic, plus realtime publishing.
- **Errors**: throw `ApiError` subclasses from `src/lib/api/errors.ts` (`NotFoundError`, `ForbiddenError`, `ValidationError`, …). `createHandler` converts them to `{ message, code, ...details }` JSON responses; anything else becomes a logged 500.

### Pages and auth

Pages use `getServerSideProps`. Protected pages wrap it with `withAuth` from `src/lib/auth/withAuth.ts` (a *different* `withAuth` from the API middleware) which redirects to login with a `redirectUrl`. NextAuth config lives in `src/lib/auth.ts`.

### i18n

Locales `en, pl, hu, de, es` via Next's built-in i18n routing (`next.config.ts`). Translations are split by namespace in `messages/<locale>/*.json`; `getMessages()` in `src/i18n/getMessages.ts` merges every namespace file, and each page must return `messages` from its `getServerSideProps`/`getStaticProps`. When adding a new namespace file, register it in `getMessages`. New user-facing strings need entries in **all five** locale directories.

### Database

- Prisma client is generated to `src/generated/prisma` (import from `@/generated/prisma/client`, never `@prisma/client`). Use the singleton in `src/lib/prisma.ts`.
- `src/lib/prisma.ts` picks the driver adapter from `DATABASE_URL`: `file:` → better-sqlite3, `libsql://`/`https://` → LibSQL (Turso). `prisma.config.ts` forces the Prisma CLI onto local SQLite when the URL is Turso, so Turso migrations go through `scripts/migrate-turso.ts`, which applies the SQL in `prisma/migrations/`.
- Vercel builds (`vercel.json`) run `migrate-turso` and `seed-currencies` before `next build`.

### Realtime

`src/lib/realtime/` wraps Pusher/Soketi. Services call `publish(Channels.x, Events.y, payload)` after mutations; clients subscribe via `src/hooks/realtime/usePusher.ts` and the SWR data hooks in `src/hooks/data/`. When realtime env vars are absent, publishing is a no-op and the UI falls back to SWR polling (`usePollingInterval`). Private channel auth is `src/pages/api/pusher/auth.ts`.

### Email

`src/lib/email/service.ts` exposes `queue*Email` functions; `sender.ts` writes an `EmailLog` row and attempts delivery through the configured provider (Brevo, SMTP, or SES under `providers/`). Templates are TS modules in `templates/` rendered through the MJML layout in `layout.ts`. Failures are retried by the `/api/cron/process-emails` and `/api/cron/retry-emails` routes (protected by `CRON_SECRET`; scheduled in `vercel.json`).

### Storage

`src/lib/storage/` uses `@tweedegolf/storage-abstraction` for local disk (`public/uploads`) or S3-compatible storage, selected by `STORAGE_PROVIDER`. Images are processed with sharp.

## Repo conventions

- Conventional commits — `CHANGELOG.md` and GitHub release notes are generated by git-cliff (`cliff.toml`) from tags `v*`.
- `.husky/pre-push` on `main` interactively prompts for a version bump (`npm version`); it is skipped in non-interactive terminals.
- Feature work uses **OpenSpec** (spec-driven): change proposals live in `openspec/changes/<change>/` (`proposal.md`, `design.md`, `tasks.md`). Workflow prompts are in `.github/prompts/opsx-*.prompt.md` and `.github/skills/openspec-*`.
- `docs/` is a separate Nextra site (its own `package.json`, excluded from the root tsconfig) published to docs.auktiva.org. User-facing or config changes should update the relevant page under `docs/content/users/` or `docs/content/developers/`.
- Env variables are documented in `.env.example` and `docs/content/developers/environment-variables.mdx`.
