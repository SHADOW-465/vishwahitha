# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
node node_modules/next/dist/bin/next dev      # Dev server (use this — npm/npx segfault in bash on Windows)
node node_modules/next/dist/bin/next build    # Production build
node node_modules/next/dist/bin/next start    # Start production server

# Tests
node node_modules/vitest/vitest.mjs run       # Run all tests once
node node_modules/vitest/vitest.mjs run src/test/smoke.test.ts  # Run single test file
node node_modules/vitest/vitest.mjs           # Watch mode

# Lint
node node_modules/next/dist/bin/next lint
```

> **Windows note:** `npm` and `npx` segfault in the Git Bash shell on this machine. Always invoke Node tools via `node node_modules/...` directly.

## Architecture

### Stack
- **Next.js 16** (App Router, Turbopack) + **React 19 RC**
- **Clerk** — auth + RBAC. Admin role gated via `user.publicMetadata.role === "admin"`
- **Supabase** — Postgres database with RLS policies
- **GSAP + ScrollTrigger** — page-level animations and scroll-driven theme inversion
- **Framer Motion** — component-level animations (tabs, cards, lightbox, counters)
- **Tailwind CSS** — Noir & Gold design system (see `tailwind.config.ts` for tokens)

### Data layer (`src/lib/`)
- `supabase.ts` — anon client (used in server components and client components for reads)
- `supabase-admin.ts` — service-role client (bypasses RLS; only for trusted server-side writes)
- `actions.ts` — read-only Supabase queries (`getInitiatives`, `getPageSection`, `getAllAnnouncements`, etc.)
- `server-actions.ts` — `"use server"` mutations (all guarded by `auth()` from Clerk); calls `revalidatePath` after writes
- `sync-user.ts` — upserts the Clerk user into Supabase `users` table; called at the top of every authenticated server page

### Theme system
`ThemeProvider` (`src/components/theme-provider.tsx`) holds a `"dark" | "light"` context and syncs it to `body[data-theme]`. CSS variables in `globals.css` flip automatically. To trigger a theme transition on scroll, wrap a section with `ThemedSection` (GSAP ScrollTrigger fires `setTheme` at 60% scroll entry). `BackgroundWrapper` reads `useTheme()` to swap between noir auras + particles (dark) and warm gold/teal blooms (light).

### CMS pattern (Page Sections)
Content for Hero headline/subtext, about story, and footer tagline is stored in the `page_sections` Supabase table keyed by `section_key`. Read via `getPageSection(key)` in `actions.ts`. Editable at `/admin` → Page Sections panel (uses `updatePageSection` server action). All pages using CMS content have `export const revalidate = 60`.

### Admin CMS
`/admin` requires `publicMetadata.role === "admin"` in Clerk. Structure:
- `AdminShell` — sidebar with 9 panels
- `CMSDrawer` — slide-out drawer for all create/edit forms
- Each panel (`AnnouncementManager`, `InitiativeManager`, `BoardManager`, `PageSectionsEditor`, `PulseFormBuilder`) is a client component that calls server actions directly

### Authenticated routes
- `/hub` — requires Clerk sign-in; calls `syncUserToSupabase()` on every load
- `/admin` — requires sign-in + `admin` role metadata

### Database migrations
SQL files in `supabase/migrations/`. Docker is not running locally — apply migrations manually in the Supabase dashboard SQL editor.

### Next.js 16 async params
Dynamic routes use `params: Promise<{ slug: string }>` — must be awaited before use.

## Testing

Tests live in `src/test/`. They use Vitest + jsdom + `@testing-library/react`. Tests mock Supabase/Clerk logic directly — no integration tests against a live database. Setup file: `src/test/setup.ts` (imports `@testing-library/jest-dom`).
