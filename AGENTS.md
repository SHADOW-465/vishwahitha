# AGENTS.md — Rotaract Club of Vishwahita

**Purpose:** Durable record of product, design, and technical decisions from the 2026-07-15 / 2026-07-16 planning sessions so future agents (and humans) correct and build against the same truth.

**Canonical long-form design:** `docs/superpowers/specs/2026-07-16-vishwahita-clubhouse-design.md`  
**Visual system:** `DESIGN.md`  
**Product overview:** `PRODUCT.md`  
**Dev commands:** `CLAUDE.md` / this file § Commands  

**Last updated:** 2026-07-16  

---

## 1. What this product is

Official digital home of the **Rotaract Club of Vishwahita**, **RI District 3234**, Group 01, Chennai.

- Chartered **10 March 1999**
- Sponsored by **Rotary Club of Madras Industrial City**
- Mottos: **“Unite for Good”** · **“Rise Above”**
- Sanskrit name sense: **universal friendship**

### Why the site exists (problem)

The club runs relatively few events and sees low participation. The site must:

1. Look **professional and official** (District / prospects / outsiders).
2. Give **members a reason to return weekly** (virtual clubroom).
3. Raise **real event turnout** (information + RSVP).
4. Let the **president run content** without a developer.

### What it is not

- A generic nonprofit brochure template  
- A public social network / empty chat feed  
- A motion/particle showcase  
- A Convex rewrite (evaluated and rejected for now)  

---

## 2. Decision log (this chat, chronological)

| # | Topic | Decision |
| --- | --- | --- |
| D1 | Design tool | Hallmark used for design discipline; project is **system-managed** via `DESIGN.md` |
| D2 | Audience | General public + Rotaracters + officials |
| D3 | Primary use | Join + showcase work + events + announcements + living pulse (newsletter-like) |
| D4 | Tone | **Luxury + editorial** — prestige + service; not playful NGO, not SaaS |
| D5 | Uniqueness | Comes from **story + structure + real club facts**, not new palettes |
| D6 | Homepage v1 redesign | “Club newspaper” story beats on `/` (interim; see D14) |
| D7 | Database | **Keep Supabase** (Postgres + RLS). Convex is better for heavy real-time multiplayer, not this CMS + light member ops shape |
| D8 | Product shape | **Approach 1: Official House + Clubroom** (approved) |
| D9 | 90-day priority order | (1) Public story/join → (2) weekly member habit → (3) real-event turnout → (4) admin power |
| D10 | Public density | Option C energy (dynamic, multi-page) — **not** one infinite homepage dump; carousels deep-link to full pages |
| D11 | Suggestions | **A + D:** Idea board **and** weekly president prompt, framed as one **Participate** space |
| D12 | Public vs member | Interaction for the small club lives **behind login**; public stays professional |
| D13 | Visual | **Remove** particle/connector backgrounds, childish multi-aura clutter, dense noise; quiet professional surfaces |
| D14 | Spec supersedes | `docs/superpowers/specs/2026-07-16-vishwahita-clubhouse-design.md` **supersedes** earlier kitchen-sink homepage density where they conflict |
| D15 | Tutorial | Soft gate only in v1 (encourage, don’t hard-block RSVP) |
| D16 | Stack | Next.js App Router · Clerk · Supabase · optional Resend digests later |
| D17 | Hub rename | Evolve `/hub` → **`/member`**; redirect `/hub` after cutover |

---

## 3. Success criteria (90 days)

| Priority | Outcome | How we know |
| --- | --- | --- |
| 1 | Stronger public story + join | Sign-ups / join clicks; District feedback |
| 2 | Members open site weekly | Prompt answers / clubroom visits ≥1×/week |
| 3 | More members at real events | RSVP vs attendance (president-reported) |
| 4 | President self-sufficient | Events/content updated without developer |

**No vanity metrics** (fake “online now”, invented impact %).

---

## 4. Architecture — three layers, one brand

```
Visitor ──► Public House ──► Join (Clerk) ──► Member Clubroom
                                               │
Admin (role) ──────────────────────────────────► Admin CMS
```

| Layer | Routes | Audience | Job |
| --- | --- | --- | --- |
| **Public House** | `/`, `/events`, `/projects/*`, `/contact`, auth | Visitors, prospects, officials | Story, proof, contact, join |
| **Member Clubroom** | `/member/*` | Signed-in members | RSVP, Participate, Learn tutorial |
| **Admin** | `/admin` | `publicMetadata.role === "admin"` | Edit all content types |

**Brand tokens:** Midnight void `#020617` · Cranberry `#D41367` (≤15% surface) · Gold `#D4AF37` · Ivory `#FAF8F5` — see `DESIGN.md`.

**Fonts:** Inter (display/body) · Playfair Display (drama) · JetBrains Mono (meta) · Instrument Serif (optional italic body emphasis only).

---

## 5. Information architecture

### Public navigation (target)

- **Home**
- **Events** → Club events · Signature projects · Legacy
- **Contact**
- **Member** → sign-in if logged out; clubroom if logged in
- **Admin** → only if admin role

### Public routes

| Route | Purpose |
| --- | --- |
| `/` | Story home (thin, dynamic — §6) |
| `/events` | Full event list + filters (upcoming / past / online) |
| Event detail | Description; RSVP if signed in |
| `/projects` | Signature projects |
| `/projects/[slug]` | Project detail |
| Legacy | **One** best/flagship project (`is_legacy`) |
| `/contact` | Contact + sponsor + District facts |
| `/sign-in`, `/sign-up` | Clerk |

### Member routes

| Route | Purpose |
| --- | --- |
| `/member` | Clubroom dashboard |
| `/member/events` | RSVP-focused list |
| `/member/participate` | Weekly prompt + idea board |
| `/member/learn` | New-member Rotaract tutorial |
| `/hub` | Temporary; **redirect to `/member`** |

### Admin manages

Events · Projects (signature + single legacy) · Milestones · Announcements · Page sections · Board/contacts · Weekly prompt · Idea statuses · Contact messages

**“Edit any column” (v1):** Every **content type** the UI shows is CMS-editable. Not freeform HTML injection of every layout pixel.

---

## 6. Public homepage — target structure

**Not everything on one page.** Top/middle = main attractions; deep lists on dedicated routes.

1. **Logo + name intro** — centered mark + club name; on first scroll (or ~1.2s) they **rise into sticky nav**. Honor `prefers-reduced-motion`.
2. **Hook** — short positioning + **Become a member** + **See events**
3. **Story** — charter, sponsor, District, meaning of Vishwahita (short)
4. **Next up** — horizontal **auto-scroll** of upcoming event cards (3–6); click → `/events` or detail
5. **Signature projects** — carousel → `/projects`
6. **Legacy spotlight** — **one** flagship project, editorial
7. **Milestones** — compact strip (4–6), not a museum wall
8. **Join** — single clear CTA
9. **Contact teaser** → `/contact`

### Remove / demote from public home (bloat)

- Particle / connector cinematic backgrounds  
- Fake live “members online”  
- Daily affirmation as large public section  
- Membership tier maze on home  
- Floating story navigator chrome  
- Full event grid dump on home  
- Invented stats  

### Interim state (already partly shipped)

Homepage “club newspaper” beats exist (`ClubBulletin`, compressed sections). Treat as **step toward** this IA; full Phase 0–1 still required per design spec.

---

## 7. Member clubroom — Participate (A + D)

### Clubroom home

- Next event + RSVP status  
- This week’s prompt (answered / not)  
- Top 3 ideas → board  
- One pinned announcement  
- Tutorial incomplete banner if needed  

### Participate tabs

1. **This week’s prompt (D)** — President posts one question/week; members answer once (existing pulse model).
2. **Idea board (A)** — Members post ideas; upvote (one per user); president status: `new` | `under_review` | `planned` | `done` | `declined`. Comments optional later.

### Learn (new member tutorial)

Checklist (CMS-editable copy):

1. What is Rotaract?  
2. Benefits for students / young professionals  
3. What members do  
4. How this club works  
5. First action: next event or weekly prompt  

Store `tutorial_completed_at` on user. **Soft gate only** in v1.

---

## 8. Roles & security

| Role | Powers |
| --- | --- |
| Visitor | Public read only |
| Member (Clerk signed-in) | Clubroom, RSVP, ideas, votes, prompt answers, tutorial |
| Admin | `user.publicMetadata.role === "admin"` + all member powers + `/admin` |

- Sync Clerk → Supabase `users` via `syncUserToSupabase` on authenticated pages.  
- Mutations: server actions with `auth()` + revalidate.  
- Admin writes: service-role client where needed; never expose service key client-side.  
- Announcements: `visibility` public | members.

---

## 9. Data layer

### Stack decision: Supabase stays

| Need | Supabase | Convex |
| --- | --- | --- |
| CMS + relational (events↔RSVP, forms↔responses) | Strong fit | Manual joins |
| Public ISR / revalidate marketing pages | Natural | Overkill real-time |
| Storage / SQL / District reporting later | Strong | Weaker |
| Always-on multiplayer clubroom | Optional Realtime | Native strength |

**Do not migrate to Convex** unless the clubroom becomes highly collaborative real-time and rewrite cost is accepted.

### Core tables (extend existing)

`users` · `events` · `event_rsvps` · `initiatives` (signature/legacy flags) · `initiative_gallery` · `milestones` · `announcements` · `page_sections` · `board_members` · `pulse_forms` / `pulse_responses` · `ideas` · `idea_votes` · `contact_messages` · `documents` · `gallery_media` (as needed)

Migrations live in `supabase/migrations/` — apply in Supabase SQL editor (Docker not assumed local).

### Honest content rules

- No invented metrics, fake testimonials, or fake online counts.  
- Real club facts only (charter date, District, confirmed stats).  
- Prefer placeholders or omit over fabrication.

---

## 10. Visual & motion rules

### Do

- Solid midnight / light theme via `ThemeProvider` + `body[data-theme]`  
- Cranberry focus rule; gold accents sparingly  
- Glass panels with restrained hover  
- Magnetic CTAs where already established  
- Animate transform/opacity only; respect reduced motion  
- Lucide icons (no emoji-as-UI)  

### Don’t

- tsparticles / connecting particle webs / dense fractal noise as chrome  
- Over-stimulating multi-bloom auras that look childish  
- Section spam: `01 · OUR STORY` tags everywhere  
- Italic AI-style display gimmicks beyond locked drama font use  
- Six equal CTAs competing with Join  

### Logo intro

First paint: logo + club name centered → scroll (or timeout) rises into nav — **one** calm motion.

---

## 11. Build phases (implementation order)

| Phase | Name | Outcome |
| --- | --- | --- |
| **0** | Visual calm | Remove particles/connectors; quiet background; nav toward target IA |
| **1** | Public House | Home structure §6, `/events`, projects + legacy, `/contact`, strip bloat |
| **2** | Member Clubroom | `/member`, RSVP, Participate (prompt + ideas), Learn tutorial |
| **3** | Admin completeness | All content types CMS; one-legacy enforcement; prompt workflow |
| **4** | Habit amplifiers | Email digest / reminders (Resend); optional hard tutorial gate |

**Next implementation work:** Phase 0 + Phase 1 first. Do not boil the ocean.

---

## 12. Hallmark / design-system notes

- `DESIGN.md` is the **locked** visual system for multi-page consistency.  
- Hallmark preflight cached in `.hallmark/preflight.json`.  
- Hallmark log: `.hallmark/log.json` (homepage club-newspaper run 2026-07-15).  
- Diversification inverted when `DESIGN.md` present: **share** system across pages.  
- Optional: `lock the system` only if exports need refresh — system already locked.

---

## 13. Codebase map (current)

```
src/app/           # App Router pages (home, about, admin, hub, announcements, gallery, initiatives, auth)
src/components/    # UI + CMS managers + club sections
src/lib/           # supabase, supabase-admin, actions, server-actions, sync-user
supabase/migrations/
docs/plans/        # older implementation plans
docs/superpowers/specs/  # 2026-07-16 clubhouse design (authoritative product design)
```

### Key patterns

- Public pages: `export const revalidate = 60` where CMS-backed  
- Dynamic routes: `params: Promise<{ slug: string }>` (Next 16)  
- Admin shell + CMSDrawer pattern for panels  
- Windows: invoke Node via `node node_modules/...` (npm/npx may segfault in Git Bash)

---

## 14. Commands

```bash
node node_modules/next/dist/bin/next dev
node node_modules/next/dist/bin/next build
node node_modules/next/dist/bin/next start
node node_modules/vitest/vitest.mjs run
node node_modules/next/dist/bin/next lint
```

---

## 15. Files that must stay aligned

| File | Role |
| --- | --- |
| `AGENTS.md` | **This file** — agent-facing decisions & structure |
| `docs/superpowers/specs/2026-07-16-vishwahita-clubhouse-design.md` | Full approved design |
| `DESIGN.md` | Tokens, type, component voice |
| `PRODUCT.md` | Product purpose (update when phases ship) |
| `CLAUDE.md` | Commands + architecture notes for Claude Code |
| `graphify-out/` | Knowledge graph of repo (generated 2026-07-16) |

### Graphify outputs (2026-07-16)

| File | Use |
| --- | --- |
| `graphify-out/graph.html` | Interactive graph in browser |
| `graphify-out/GRAPH_REPORT.md` | Audit report (god nodes, communities) |
| `graphify-out/graph.json` | Raw graph for agents / GraphRAG |

Corpus: ~93 project files (code + docs + migrations). Re-run: `/graphify` or `/graphify --update` after major doc/code changes.

When correcting course: update **this file** and the design spec together if a decision changes.

---

## 16. Explicit non-goals (v1)

- Public free-form social feed  
- Fake live presence  
- Convex migration  
- Multi-tier board roles beyond admin/member  
- Gamification badges  
- Particle / 3D / connector background systems  
- Hard tutorial gate (unless president later demands it)  

---

## 17. Open defaults (locked unless overridden)

| Topic | Default |
| --- | --- |
| Tutorial gate | Soft |
| Idea comments | Off (upvotes on) |
| Database | Supabase |
| Hub path | Redirect to `/member` |
| Homepage | Spec § public home, not old full bloat |

---

*End of AGENTS.md — keep this file short enough to re-read, complete enough to prevent re-litigating settled decisions.*
