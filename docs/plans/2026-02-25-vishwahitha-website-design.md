# Rotaract Club of Vishwahita — Website Design Document
**Date:** 2026-02-25
**Approach:** Extend & Enrich (Approach A — build on existing Next.js/Clerk/Supabase codebase)

---

## 1. Site Architecture

```
/                         Homepage
/about                    Club story + Leadership board (CMS-editable)
/initiatives              All initiatives listing (filterable)
/initiatives/[slug]       Initiative detail (cinematic: stats, gallery, timeline)
/gallery                  Visual archive (masonry + lightbox)
/announcements            Public announcements feed
/hub                      Members-only portal (auth-gated)
/admin                    Full CMS dashboard (admin role only)
/sign-in  /sign-up        Clerk auth (existing)
```

**Navbar:** Floating pill, morphs on scroll. Links: Home · About · Initiatives · Gallery · Announcements · Hub (signed-in only). CTA: Sign In / UserButton.

---

## 2. Design System

### Color Palette — "Noir & Gold" with Scroll-Driven Theme Inversion

```
DARK ZONES
  Background:    #08080F   (near-black, deep void)
  Primary Gold:  #C9A84C → #FFD97D  (gradient — matches club logo)
  Accent Red:    #E8394D   (vivid coral-crimson — youth, energy)
  Accent Teal:   #00C9A7   (electric teal — service, growth)
  Text:          #FAF8F5

LIGHT ZONES  (scroll-revealed, alternating sections)
  Background:    #FAFAF4   (warm cream)
  Gold on light: #B8860B
  Accent Red:    #E8394D   (same)
  Text:          #0D0C14

TRANSITION
  Mechanism: clip-path iris wipe OR horizontal paint-wipe
  Duration: 0.9s, ease: power3.inOut
  Navbar inverts in sync via IntersectionObserver
```

### Typography

```
Headings:    Plus Jakarta Sans — Bold, tight tracking (Google Fonts, existing)
Drama serif: Cormorant Garamond — Italic, used for hero pull-quotes & section accents
Mono:        JetBrains Mono — data, labels, timestamps (existing)
```

Add Cormorant Garamond via `next/font/google` in `layout.tsx`.

### Component Tokens
- Container radius: `rounded-[2rem]` to `rounded-[3rem]`
- Glass panels: `bg-white/5 border border-white/10 backdrop-blur-xl`
- Gold gradient text: `bg-gradient-to-r from-[#C9A84C] to-[#FFD97D] bg-clip-text text-transparent`
- Noise overlay: SVG `<feTurbulence>` at 0.05 opacity on `::before` of `body`

---

## 3. Animation Blueprint

### Theme Inversion Engine
- `ThemeProvider` React context — `theme: "dark" | "light"`
- Each `<section>` has `data-theme="dark|light"`
- Global `ScrollTrigger.create` per section fires `setTheme()` on enter
- `gsap.to(body, { backgroundColor, color, duration: 0.9, ease: "power3.inOut" })`
- Navbar text/border subscribes to theme context

### Per-Component Animations

| Component | Animation | Library | Trigger |
|---|---|---|---|
| Navbar | Transparent → frosted glass pill, width morph, color inversion | GSAP + IntersectionObserver | Scroll past hero |
| Hero text | Staggered fade-up: `y: 60→0, opacity: 0→1, stagger: 0.12` | GSAP `power4.out` | Page load, 0.3s delay |
| ProjectShuffler | Spring-bounce card cycling `cubic-bezier(0.34, 1.56, 0.64, 1)` | Framer Motion | Auto 4s + click |
| Initiative detail hero | Parallax pin: image fixed, text scrolls over | GSAP ScrollTrigger `pin: true` | Scroll |
| Impact counters | Count-up on viewport entry | Framer Motion `useMotionValue` + `useInView` | InView |
| Horizontal timeline | Left-to-right scroll inside pinned section | GSAP ScrollTrigger horizontal | Scroll |
| Gallery lightbox | `layoutId` shared layout expand | Framer Motion | Click |
| Announcements feed | Staggered slide-in: `x: -40→0, stagger: 0.08` | Framer Motion | InView |
| Pulse form | Progress bar fill, animated question widgets | Framer Motion | User interaction |
| Admin drawers | Slide-out: `x: 100%→0`, spring physics | Framer Motion | Click |
| About story text | Word-by-word fade-up reveal | GSAP ScrollTrigger | Scroll |
| Section transitions | Background + text color repaint | GSAP + ScrollTrigger | Scroll enter |
| Particles | Density/color shifts on theme change | tsParticles | Theme context |

---

## 4. Database Schema Changes

### New Tables

```sql
-- Announcements (tiered visibility)
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tag TEXT CHECK (tag IN ('event', 'update', 'urgent', 'general')) DEFAULT 'general',
  visibility TEXT CHECK (visibility IN ('public', 'members')) DEFAULT 'public',
  is_pinned BOOLEAN DEFAULT false,
  created_by TEXT NOT NULL,  -- Clerk user ID
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Initiatives (replaces hardcoded array)
CREATE TABLE initiatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,         -- avenue label
  short_description TEXT,          -- shown on shuffler card
  full_description TEXT,           -- shown on detail page
  impact_stat TEXT,                -- e.g. "320"
  impact_label TEXT,               -- e.g. "elders served"
  hero_image_url TEXT,
  color_class TEXT,                -- tailwind class for card accent
  is_featured BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Per-initiative gallery
CREATE TABLE initiative_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id UUID REFERENCES initiatives(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Weekly Pulse forms
CREATE TABLE pulse_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_label TEXT NOT NULL,        -- e.g. "Week of Feb 24, 2026"
  questions JSONB NOT NULL,        -- [{id, question, type: "rating"|"pill-select"|"text", options?: []}]
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Weekly Pulse responses
CREATE TABLE pulse_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES pulse_forms(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL,
  answers JSONB NOT NULL,          -- {[questionId]: value}
  comment TEXT,                    -- open free-text
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(form_id, member_id)
);

-- CMS page sections
CREATE TABLE page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL, -- 'hero_headline', 'hero_subtext', 'about_story', 'footer_tagline'
  content JSONB NOT NULL,           -- {text: "...", ...} flexible per key
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by TEXT                   -- Clerk user ID
);
```

### Existing Tables Extended
- `board_members` — already exists, wired to admin editor
- `gallery_media` — add `initiative_id UUID REFERENCES initiatives(id)` column for tagging
- `feedback` — kept as legacy free-text channel

---

## 5. Feature Specifications

### F1 — Announcements
- Admin: create/edit/delete/pin, set visibility (public / members-only), tag
- `/announcements` page: public posts, pinned float top (gold border), staggered animation
- Hub Feed tab: public + members-only, members-only tagged with gold lock badge
- Navbar badge: unread count since last visit (localStorage timestamp comparison)

### F2 — Initiatives (Dynamic)
- `ProjectShuffler`: reads from `initiatives` table, spring-bounce cycling, click → `/initiatives/[slug]`
- `/initiatives`: filterable grid by `category`, magnetic tilt cards
- `/initiatives/[slug]`: pinned parallax hero, impact counter bar, full description, photo gallery (from `initiative_gallery`), horizontal scroll timeline, volunteer/contact CTA

### F3 — Weekly Pulse
- Hub "Weekly Pulse" tab: fetches active `pulse_form`
- Question widget types: `rating` (1-5 star), `pill-select` (multi-choice pill buttons), `text` (textarea)
- Progress bar fills as questions are answered
- Submit: `pulse_responses` insert, cinematic expanding ring confirmation
- One submission per `(form_id, member_id)` — enforced at DB + UI level
- Admin: form builder (add/remove questions, activate form), responses viewer with per-question bar charts

### F4 — Member Hub (Tab-Based)
Replace flat layout with 5 tabs:
1. **Feed** — real announcements from DB + RSVP prompts for upcoming events
2. **My Events** — `event_rsvps` filtered to current user, status toggle
3. **Documents** — existing `DocumentRepository` (unchanged)
4. **Directory** — enhanced `MemberDirectory` with avatar + role + avenue badge
5. **Weekly Pulse** — active form, or "Submitted this week" state if already responded

### F5 — Admin CMS (Sidebar Layout)
Left sidebar with sections:
- Overview (stat cards)
- Announcements (CRUD + pin)
- Initiatives (CRUD + gallery per initiative)
- Events (existing EventManager)
- Gallery (existing upload + initiative tag)
- Board Members (add/edit/remove/reorder)
- Page Sections (rich-text for hero, about, footer)
- Pulse Forms (form builder + activate)
- Pulse Responses (aggregator + charts)
- Broadcast (existing BroadcastCenter)

All create/edit forms: slide-out drawer (`x: 100%→0`, spring physics), Framer Motion.

### F6 — Theme Inversion Engine
Global scroll-driven dark↔light repaint. Sections alternate themes. Navbar inverts in sync.

### F7 — Gallery (Enhanced)
Keep masonry grid. Add: `layoutId` lightbox, filter tabs by initiative, admin initiative tagging.

### F8 — About Page
Story text from `page_sections('about_story')`. Board members from `board_members` table. GSAP word-by-word scroll reveal for story text.

---

## 6. Implementation Sequence

1. **Database migrations** — new tables + RLS policies
2. **Design tokens** — update Tailwind config (new palette), add Cormorant Garamond, noise overlay
3. **ThemeProvider + Theme Inversion Engine** — global context + ScrollTrigger wiring
4. **Navbar enhancement** — pill morphing, color inversion, announcement badge
5. **Homepage** — hero (enhanced), ProjectShuffler (DB-driven), SponsorShowcase
6. **Initiatives system** — DB-driven shuffler, `/initiatives` page, `/initiatives/[slug]` detail page
7. **Announcements** — table, admin CRUD, `/announcements` page, hub feed integration
8. **Hub redesign** — 5-tab layout, real announcements feed, my events tab
9. **Weekly Pulse** — form builder in admin, question widgets in hub, response aggregator
10. **Admin CMS** — sidebar layout, all existing tools migrated, new tools added (board members, page sections, initiative gallery, pulse builder)
11. **Gallery** — lightbox, filter tabs, initiative tagging
12. **About page** — CMS-wired story, GSAP scroll reveal
13. **Polish pass** — noise overlay, particle theme shifts, all micro-interactions, mobile responsive
