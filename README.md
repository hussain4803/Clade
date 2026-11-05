# Apex Velocita Racing

The digital home of **Apex Velocita Racing (AVR)**, a fictional two-car Hypercar team that races the 24 Hours of Le Mans, Daytona, Sebring and other long-distance events.

It's a full-stack Next.js app. Pages render on the server, interactive parts run on the client, and real API routes save data to a local SQLite database through Prisma. It uses no paid services, no authentication and no payment processing.

> **Every piece of data here is fictional.** That covers the drivers, crew, specifications, race results, competitors, partners, articles and contact details. Event names such as "24 Hours of Le Mans" refer to real races for context only, and no affiliation is implied. Contact addresses use the reserved `example.com` domain.

---

## Quick start

**Prerequisites:** Node.js **20.9 or newer** (22 LTS recommended) and npm.

```bash
npm install          # also runs `prisma generate`
npm run setup        # creates .env, applies migrations, seeds sample data
npm run dev          # http://localhost:3000
```

Open **http://localhost:3000** for the local preview.

`npm run setup` is safe to run again. It copies `.env.example` to `.env` if `.env` doesn't exist yet, runs `prisma migrate deploy`, and seeds the database. Re-seeding rebuilds races, drivers and articles but keeps contact and newsletter submissions. To clear those as well, run `SEED_RESET_SUBMISSIONS=true npm run db:seed`.

### Production build

```bash
npm run build
npm run start        # http://localhost:3000
```

---

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server (Turbopack) on port 3000 |
| `npm run build` / `npm run start` | Builds for production and serves the build |
| `npm run setup` | One-step setup: `.env` + migrations + seed |
| `npm run db:migrate` | Applies Prisma migrations (`prisma migrate deploy`) |
| `npm run db:seed` | Re-seeds the fictional sample data |
| `npm run db:reset` | Drops the database, re-applies migrations and re-seeds |
| `npm run db:studio` | Opens Prisma Studio to browse the data, including form submissions |
| `npm run lint` | ESLint (`eslint-config-next`, flat config) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit and API tests, run against a separate seeded `prisma/test.db` |
| `npm run test:e2e` | Playwright end-to-end tests, run against the production build |
| `npm run smoke` | Calls every API route on a running server and checks the JSON |
| `npm run images` | Regenerates all raster artwork in `public/images` |

---

## Testing

```bash
npm run lint && npm run typecheck   # static checks
npm test                            # 54 unit + API tests (Vitest)

npm run build                       # e2e runs against the production build
npx playwright install chromium     # first time only
npm run test:e2e                    # 21 browser tests (starts `next start` on :3100)

npm run dev                         # in another terminal
npm run smoke                       # 20 live API checks (BASE_URL=... to target another server)
```

- **Unit tests** (`tests/unit`) cover the Zod schemas, race-status logic, countdown maths, date formatting, the article markup parser and the rate limiter.
- **API and data tests** (`tests/api`) call the real route handlers and data layer against a freshly migrated and seeded `prisma/test.db`. Time-dependent behaviour such as live, upcoming and completed status and the next race is tested with fixed clocks.
- **End-to-end tests** (`tests/e2e`) cover:
  - every nav link and the hero CTAs
  - the hamburger menu, including Escape and focus return
  - race filters, confirming they don't trigger a full reload
  - news search, category filters and pagination
  - the newsletter flow (invalid, success and duplicate)
  - the contact form (validation and success)
  - back-to-top, livery tabs and demo links
  - the skip link and reduced motion
  - no horizontal overflow at 320, 375, 768, 1024, 1440 and 1920 px, and no console errors

The e2e and smoke runs write a few newsletter and contact rows to your local database, using `example.com` addresses.

---

## Project structure

```
├─ prisma/
│  ├─ schema.prisma            # data model (SQLite)
│  ├─ migrations/              # SQL migrations
│  ├─ seed.ts                  # idempotent seed script
│  └─ seed-data/               # fictional races, drivers, articles (+ deterministic RNG)
├─ public/images/              # generated artwork (hero, circuits, news, drivers, liveries, OG card)
├─ scripts/
│  ├─ setup.mjs                # one-step local setup
│  ├─ generate-images.tsx      # SVG → WebP artwork generator (sharp)
│  └─ smoke-api.mjs            # live API checks
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx            # fonts, metadata, header/footer, back-to-top
│  │  ├─ template.tsx          # page enter transition
│  │  ├─ page.tsx              # Home
│  │  ├─ team/ cars/ contact/  # static-ish pages
│  │  ├─ races/(list)/         # calendar (+ loading skeleton)
│  │  ├─ races/[slug]/         # race detail (circuit, schedule, results)
│  │  ├─ news/(list)/          # news listing (+ loading skeleton)
│  │  ├─ news/[slug]/          # article
│  │  ├─ api/                  # route handlers (see below)
│  │  ├─ not-found.tsx error.tsx sitemap.ts robots.ts icon.svg
│  ├─ components/
│  │  ├─ art/                  # CarSvg, HelmetArt, CircuitTrace (pure SVG, shared with generator)
│  │  ├─ layout/               # SiteHeader (mobile menu), SiteFooter, BackToTop, Logo
│  │  ├─ home/ team/ cars/ races/ news/ forms/
│  │  └─ ui/                   # Button, Badge, SectionHeading, Reveal, Skeleton, DemoLink, Icons…
│  ├─ content/                 # typed static content: car specs & liveries, crew, partners, contact
│  └─ lib/                     # prisma client, validation (Zod), data access, API helpers, formatting
└─ tests/ unit/ api/ e2e/ setup/
```

---

## Database models

These live in `prisma/schema.prisma`. The database is SQLite, stored at `prisma/dev.db`.

| Model | Purpose | Key fields |
| --- | --- | --- |
| `Race` | One event on the calendar | `slug` (unique), `series` (`WEC`/`IMSA`), `season`, `round`, `startDate`, `endDate`, `timeZone`, circuit fields, `heroImage` |
| `RaceSession` | Race-week schedule | `raceId`, `name`, `kind` (`PRACTICE`/`QUALIFYING`/`WARMUP`/`RACE`), `startsAt`, `endsAt`, `order` |
| `RaceResult` | Fictional classification | `raceId`, `position` (unique per race), `carNumber`, `team`, `drivers`, `laps`, `gap`, `bestLap`, `status`, `isTeamEntry` |
| `Driver` | Roster | `slug`, `number` (unique), `role`, `carNumber` (`18`/`81`/`RESERVE`), `nationality`, `bio`, `quote`, career stats |
| `Article` | News | `slug`, `title`, `excerpt`, `body` (light markup), `category`, `tags`, `author`, `coverImage`, `publishedAt` |
| `ContactSubmission` | Contact form messages | `name`, `email`, `topic`, `subject`, `message`, `status`, `createdAt` |
| `NewsletterSubscriber` | Newsletter sign-ups | `email` (unique, lowercased), `source`, `createdAt` |

Race **status is never stored**. It's worked out from `startDate`/`endDate` at request time (`upcoming` → `live` → `completed`), so the countdown, filters and badges stay correct as time passes. If a completed race has no results, it shows "Results pending".

---

## API

Every response uses the same shape:

```jsonc
{ "success": true,  "data": …, "meta"?: { … }, "message"?: "…" }
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "…", "fields"?: { "email": "Enter a valid email address." } } }
```

| Method & path | Description | Query / body |
| --- | --- | --- |
| `GET /api/health` | Health check, including a database ping (`503` if the DB is down) | — |
| `GET /api/races` | Races with filtering and sorting | `series=WEC,IMSA` · `status=upcoming\|live\|completed` · `season=2027` · `from=YYYY-MM-DD` · `to=YYYY-MM-DD` · `sort=date_asc\|date_desc` · `limit=1..100` |
| `GET /api/races/:id` | One race with circuit info, sessions, results and previous/next | `:id` is an id **or** a slug, e.g. `le-mans-2027` |
| `GET /api/news` | Articles with search, category and pagination | `q` (all terms must match) · `category=race-report\|team\|technical\|drivers\|behind-the-scenes` · `page` · `pageSize=1..24` |
| `GET /api/news/:id` | One article with up to three related stories | id **or** slug |
| `GET /api/drivers` | Driver roster | `car=18\|81\|RESERVE` (optional) |
| `POST /api/contact` | Validates and stores a contact message → `201` | JSON `{ name, email, topic, subject, message }` |
| `POST /api/newsletter` | Validates and stores a subscription → `201`. A duplicate (any letter case) returns `200` with `alreadySubscribed: true` | JSON `{ email, source? }` |

The API also handles these cases:

- Invalid query parameters or fields return `400 VALIDATION_ERROR` with per-field messages.
- Malformed JSON returns `400 INVALID_JSON`.
- A non-JSON body returns `415`.
- A body over 16 KB returns `413`.
- An unknown id returns `404 NOT_FOUND`.
- Unexpected errors are logged on the server and return a generic `500`.
- Both POST routes have a hidden honeypot field and a small in-memory per-IP rate limit. Set `RATE_LIMIT_DISABLED=true` to turn the limit off.

```bash
curl "http://localhost:3000/api/races?series=WEC&status=upcoming"
curl -X POST http://localhost:3000/api/newsletter -H "Content-Type: application/json" -d '{"email":"fan@example.com"}'
```

---

## Design notes

- **Palette:** CSS variables live in `src/app/globals.css` and are mapped to Tailwind v4 tokens:
  - carbon `#0B0D10`
  - graphite `#14181D`
  - electric blue `#00A3FF`
  - endurance orange `#FF6B00`
  - white `#F5F7FA`
  - cool gray `#9AA4AF`
  - success `#22C55E`
  - danger `#EF4444`
- **Type:** *Chakra Petch* for display, *Manrope* for body copy and *JetBrains Mono* for telemetry and labels. All three are self-hosted with `next/font`.
- **Textures:** asphalt grain, a carbon weave, thin technical grid lines and diagonal racing stripes, all done in pure CSS and SVG.
- **Artwork:** the car, helmets and circuit outlines are drawn in code (`src/components/art`). Raster versions are generated with `npm run images` and served through `next/image`, which provides responsive `sizes`, AVIF/WebP and lazy loading.
- **Motion:**
  - page enter transitions
  - section reveals that only hide content starting below the fold, so nothing is hidden without JS
  - card and button hover states
  - an animated countdown
  - spinning wheels and light streaks

  All of it turns off under `prefers-reduced-motion`.
- **Accessibility:**
  - skip link
  - landmark and heading structure
  - `aria-current` on navigation
  - accessible mobile menu with focus trap, Escape to close and focus return
  - ARIA tabs with arrow-key support
  - labelled form errors (`aria-invalid`, `aria-describedby`) and live status regions
  - 44 px minimum touch targets
  - inactive demo links rendered as disabled controls with labels

---

## Troubleshooting

- **`The table main.Race does not exist` or an empty site:** run `npm run setup`.
- **Port already in use:** `npm run dev -- -p 3001`.
- **Playwright can't find a browser:** run `npx playwright install chromium` once.
- **Changed the schema?** `npx prisma migrate dev --name <change>` and then `npm run db:seed`.
