# AGENTS.md — Rotaract Club of Vishwahita

**Purpose:** Durable record of product, design, and technical decisions from the 2026-07-15 / 2026-07-16 planning sessions so future agents (and humans) correct and build against the same truth.

**Canonical long-form design:** `docs/superpowers/specs/2026-07-16-vishwahita-clubhouse-design.md`  
**Visual system:** `DESIGN.md`  
**Product overview:** `PRODUCT.md`  
**Dev commands:** `CLAUDE.md` / this file § Commands  

**Last updated:** 2026-07-16 (parity checklist §11a added)  

---

## 1. What this product is

Official digital home of the **Rotaract Club of Vishwahita**, **RI District 3234**, Group 02, Chennai.

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
| D18 | Competitor parity | Match **Ambattur-class public completeness** (standing, board, gallery, join form, avenues, events page) while keeping clubroom/CMS as our edge; do **not** copy AI template slogans or vanity stats |
| D19 | Phase 0+1 tickets | Public House work tracked in **§11a** (Ambattur parity checklist). Phase 2+ deferred. |

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
| **1** | Public House | Home structure §6 + **Ambattur parity** (§11a), `/events`, projects + legacy, `/contact`, join form, strip bloat |
| **2** | Member Clubroom | `/member`, RSVP, Participate (prompt + ideas), Learn tutorial — **not in current ticket set** |
| **3** | Admin completeness | All content types CMS; one-legacy enforcement; prompt workflow — **not in current ticket set** |
| **4** | Habit amplifiers | Email digest / reminders (Resend); optional hard tutorial gate — **not in current ticket set** |

**Status (2026-07-16):** Phases 0–4 complete. Remote Supabase bootstrapped via MCP. Habit emails need `RESEND_API_KEY` in env to send.

### Competitive references (context only)

| Club site | Takeaway |
| --- | --- |
| [racambattur.org](https://www.racambattur.org/) | Strong public brochure: parent Rotary, D3234, mission/vision, avenues, signature projects, gallery, board, events teaser + calendar, join form + requirements. **Parity target for public jobs.** |
| [rotractclubofnanganallurelite.org.in](https://rotractclubofnanganallurelite.org.in) | Weak official signal (AI Studio shell / little SSR content). **Anti-pattern** — avoid empty SPA, generic AI chrome, missing institutional spine. |

**Our edge (do not dilute in Phase 0–1):** CMS-backed content, club bulletin, real charter depth (1999 + named sponsor), auth/roles foundation for later clubroom. Phase 0–1 makes the **public house as complete as Ambattur**; Phase 2+ makes us **clearly better**.

---

## 11a. Phase 0 + Phase 1 tickets (Ambattur parity checklist)

Status legend: `[ ]` todo · `[~]` partial / in repo but not at target · `[x]` done  

**Acceptance for “Phase 1 complete”:** all P0/P1 tickets below are `[x]`, public site has no particle/connector chrome, and a cold visitor can understand who we are, see proof, and apply/join without signing into a member product.

### Phase 0 — Visual calm (unblock professionalism)

| ID | Ticket | Ambattur gap / why | Done when |
| --- | --- | --- | --- |
| **P0-1** | Remove particle / connector cinematic background from root layout | They look calm; we look busy | `[x]` Unmounted; solid paper only (2026-07-16) |
| **P0-2** | Neutralize childish global noise / multi-aura clutter | Restraint = official | `[x]` Noise overlay off; BackgroundWrapper quiet (2026-07-16) |
| **P0-3** | Nav → target public IA | They have clear sections; we need clear routes | `[x]` About · Events · Notices · Contact · Member · Admin (2026-07-16) |
| **P0-4** | Prefer empty/honest over fake live metrics | They show empty events honestly | `[x]` Fake announcement badge removed (2026-07-16) |
| **P0-typo** | Restore novel display typography | User preference | `[x]` Inter + Instrument Serif drama scale on hero/join (2026-07-16) |

### Phase 1 — Public House (parity + our structure)

#### 1A · Homepage structure (dynamic, not dump)

| ID | Ticket | Ambattur equivalent | Done when |
| --- | --- | --- | --- |
| **P1-1** | Logo + club name intro → rises into sticky nav | Their clear brand open | First paint mark+name; one calm motion to nav; reduced-motion safe |
| **P1-2** | Hook: short positioning + Join + See events | Hero dual CTA | Primary join, secondary events; no 4+ CTAs |
| **P1-3** | **Official standing** strip | Club / parent / District cards | Charter 10 Mar 1999 · Rotary Club of Madras Industrial City · RI District 3234 · Group 01 (CMS or static facts) |
| **P1-4** | Story block (short) | About us | One paragraph Vishwahita meaning + who we serve; not a wall of text |
| **P1-5** | Events **carousel** (3–6 cards) → `/events` | Top 3 events + full calendar link | Auto-scroll or horizontal strip; click opens events page; empty state: “No upcoming events” |
| **P1-6** | Signature projects carousel → projects | Signature projects section | Named **Signature projects** (not “bento archive”); deep-link to list/detail |
| **P1-7** | **Legacy** spotlight (one project) | (they lack deep legacy — our win) | Exactly one flagship `is_legacy` treatment on home |
| **P1-8** | **Board strip** (public) | Leadership team | President / Secretary / key officers with real names; link to `/about` if more |
| **P1-9** | **Gallery teaser** (3–6 real photos) → `/gallery` | Gallery section | Real club photos only; no stock-as-final; empty if none |
| **P1-10** | Mission (+ optional vision) one-liners | Mission / vision | CMS `page_sections`; not slogan spam |
| **P1-11** | **Avenues** as tags/map (not 4 fake feature cards) | Our Avenues | Projects tagged Club / Community / Professional / International; small public map or filters |
| **P1-12** | Join block: **requirements + prospect form** + Clerk optional | Join form + requirements | Age/commitment bullets + form (name, email, phone, why) stored for president; sign-up secondary |
| **P1-13** | FAQ only for join friction | Implicit in requirements | Keep short; join-focused |
| **P1-14** | Contact teaser → `/contact` | Footer/join adjacency | Email / social / city line |
| **P1-15** | Strip home bloat | Cleaner than multi-section AI soup | Off home: affirmation, fake pulse, membership tiers maze, story navigator chrome, full dump grids |

#### 1B · Dedicated public routes

| ID | Ticket | Ambattur equivalent | Done when |
| --- | --- | --- | --- |
| **P1-16** | `/events` full list + filters | View full calendar | Upcoming / past / online; revalidate; empty state honest |
| **P1-17** | Event detail + RSVP if signed in | Event depth | Public can read; members RSVP (auth gate for write only) |
| **P1-18** | `/projects` (or keep `/initiatives` with redirect) | Signature projects index | Signature list + legacy flagship; rename UI to Projects |
| **P1-19** | `/projects/[slug]` detail | Project depth | Real copy + optional gallery |
| **P1-20** | `/contact` page | Contact / join adjacency | Contact facts + form endpoint; sponsor/District line |
| **P1-21** | `/gallery` works with real media | Gallery | No broken empty chrome; captions with event name when possible |
| **P1-22** | `/about` thin official page | About + leadership | Standing + board + story overflow from home |

#### 1C · CMS / data enough for public (still Phase 1 — not full Phase 3)

| ID | Ticket | Why Phase 1 | Done when |
| --- | --- | --- | --- |
| **P1-23** | President can edit events for public calendar | Parity needs live events | Existing admin events CRUD wired to public `/events` + carousel |
| **P1-24** | President can edit board members for public strip | Leadership section | `board_members` on home/about |
| **P1-25** | Prospect / contact messages stored | Join form without Clerk | `contact_messages` (or equivalent) + admin list or email; no invented CRM |
| **P1-26** | Page sections for standing/mission/hero | Copy without deploy | Keys documented; admin Page Sections covers them |
| **P1-27** | Honest stats only | Beat AI vanity | Home stats only if president-confirmed; else omit |

#### 1D · Explicitly out of Phase 0–1 (do not build yet)

| Deferred | Phase |
| --- | --- |
| Idea board, weekly prompt UI, tutorial gate | Phase 2 |
| `/member` rename + clubroom dashboard | Phase 2 |
| Ideas moderation, pulse builder polish, digests | Phase 3–4 |
| Convex, chat feed, fake presence | Never (v1) |

### Suggested implement order (single sequence)

```text
P0-1 → P0-2 → P0-3 → P0-4
  → P1-3, P1-2, P1-4          # standing + hook + story
  → P1-16, P1-5               # events page then home carousel
  → P1-18, P1-6, P1-7         # projects + signature + legacy
  → P1-8, P1-9, P1-21, P1-22  # board, gallery, about
  → P1-10, P1-11              # mission, avenues
  → P1-20, P1-12, P1-25       # contact + join form
  → P1-1, P1-13, P1-14, P1-15 # logo intro, FAQ, teaser, bloat strip
  → P1-17, P1-23–P1-27        # detail, CMS wire, honest stats
```

### Definition of done (Phase 1 gate)

- [x] Cold visitor understands club, District, sponsor, and how to join in &lt; 1 minute  
- [x] No particle/connector backgrounds  
- [x] Events and projects deep-link off home (no full dump)  
- [x] Join works without requiring full member product (prospect form)  
- [x] Board + gallery teaser + contact exist as public proof  
- [x] No invented metrics (fake badge removed; empty events honest)  
- [x] Phase 2 not started  

**Shipped 2026-07-16:** `/events`, `/events/[id]` + RSVP, `/contact`, home standing/carousel/legacy/board/gallery/mission/join, brand intro, migration for `contact_messages` + `is_legacy` + `is_online`.

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
