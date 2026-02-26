# Mobile Responsiveness Design — Vishwahitha

**Date:** 2026-02-26
**Status:** Approved

## Goal

Make every page and component work correctly on mobile (360px+) and tablet (640px+) screens without breaking the existing noir/gold cinematic aesthetic.

## Scope

All public pages + admin panel. No design language changes — same pill navbar, same typography scale, same glass panels.

---

## 1. Navbar — Dropdown Pill Menu

**Problem:** All nav links hidden behind `hidden lg:flex`. Zero fallback on < 1024px.

**Solution:** Add a hamburger toggle button visible only on `< lg`. When tapped, `AnimatePresence` animates the pill's height open to reveal stacked nav links. Closes on link click or outside tap.

**Implementation:**
- Add `menuOpen` state to `Navbar`
- Replace `motion.header` with a `motion.div` wrapper that uses `AnimatePresence` to animate a dropdown beneath the pill row
- Hamburger: `Menu` icon (lucide-react), shown on `lg:hidden`
- Dropdown list: `flex flex-col gap-1 py-3` with the same `linkClass` styling
- `useEffect` to close on outside click via `mousedown` listener
- Close on `Link` click via `onClick={() => setMenuOpen(false)}`
- The pill's `rounded-[3rem]` changes to `rounded-3xl` when open to accommodate the rectangular dropdown shape

**Changes:** `src/components/navbar.tsx`

---

## 2. Hero — Typography & Padding Scale

**Problem:**
- Drama text at `text-[5rem]` overflows on small phones
- `pt-40` (160px) consumes most of the mobile viewport before content starts
- Vignette blob at `w-[600px] h-[400px]` is oversized

**Solution:**
- Drama text: `text-[3rem] sm:text-[4.5rem] md:text-[7rem] lg:text-[9rem] xl:text-[11rem]`
- Heading: `text-4xl sm:text-5xl md:text-7xl lg:text-8xl`
- Padding: `px-5 pt-28 pb-16 md:pt-40 md:pb-24 lg:pt-48 lg:pb-32`
- Vignette: `w-full sm:w-[600px]` with `max-w-[600px]`

**Changes:** `src/components/hero.tsx`

---

## 3. Admin Shell — Collapsible Sidebar

**Problem:** Fixed `w-56` sidebar + horizontal `flex` layout is unusable on mobile.

**Solution:** On mobile, sidebar becomes a collapsible top bar:
- Add `sidebarOpen` state (default `false` on mobile, `true` on desktop via media query or always-open on `md+`)
- Layout: `flex-col md:flex-row`
- Sidebar: `w-full md:w-56` with `hidden md:block` for the always-open desktop version; on mobile a "Menu" toggle button reveals it via `AnimatePresence`
- Active panel label shown in the mobile toggle button so users know where they are

**Changes:** `src/components/admin/admin-shell.tsx`

---

## 4. Global Padding & Spacing

**Problem:** Pages use `pt-32` (128px) and `p-8` (32px) uniformly across all screen sizes.

**Fixes per file:**
- `src/app/about/page.tsx` — `pt-32` → `pt-24 md:pt-32`, section `p-8` → `p-5 md:p-8`, accent blob `w-64 h-64` → `w-40 h-40 md:w-64 md:h-64`
- `src/app/hub/page.tsx` — `pt-32` → `pt-24 md:pt-32`
- `src/components/announcement-card.tsx` — `p-8` → `p-5 md:p-8`
- `src/components/initiative-card.tsx` — `p-8` → `p-5 md:p-8`, placeholder `text-5xl` → `text-4xl md:text-5xl`
- `src/components/hub-tabs.tsx` — event card `flex items-center justify-between` → `flex flex-col sm:flex-row items-start sm:items-center gap-3`, pulse form `p-8` → `p-5 md:p-8`
- `src/components/footer.tsx` — `pt-20 pb-10 mt-32` → `pt-12 pb-8 mt-16 md:pt-20 md:pb-10 md:mt-32`

---

## 5. Grid Breakpoints — Add `sm:` Steps

**Problem:** Grids jump from 1 column to 3–4 columns with no tablet step.

**Fixes:**
- `src/app/about/page.tsx` board grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- `src/components/project-shuffler.tsx` grid: `grid-cols-1 lg:grid-cols-2` → `grid-cols-1 md:grid-cols-2`, card height `h-[420px]` → `h-[320px] md:h-[420px]`
- `src/components/live-event-calendar.tsx` grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` → stays the same (already good)
- `src/components/member-directory.tsx` grid: same, stays good
- `src/components/admin/admin-shell.tsx` stats: `grid-cols-2 lg:grid-cols-4` → `grid-cols-2 md:grid-cols-4`

---

## 6. Sponsor Showcase — Mobile Fade Masks

**Problem:** `w-40` gradient masks are 160px = ~44% of a 360px mobile viewport, hiding most of the scrolling text.

**Fix:** `w-16 sm:w-28 md:w-40` — masks shrink on mobile so more sponsor text is visible.

**Changes:** `src/components/sponsor-showcase.tsx`

---

## Architecture Notes

- No new dependencies needed (Framer Motion and lucide-react already present)
- All changes are Tailwind class additions/replacements
- No data layer changes
- Theme system untouched

## Testing

After implementation, manually verify on:
- 360px wide (Galaxy S8 size) — most constrained
- 375px (iPhone SE)
- 768px (iPad)
- 1024px (iPad Pro / small laptop) — breakpoint where desktop nav kicks in
