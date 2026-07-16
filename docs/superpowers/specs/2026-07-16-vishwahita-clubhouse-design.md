# Design: Rotaract Club of Vishwahita — Official House + Clubroom

**Date:** 2026-07-16  
**Status:** Approved for planning (pending user review of this file)  
**Product:** Official website for Rotaract Club of Vishwahita · RI District 3234  
**Approach:** Official House + Clubroom (Approach 1)  
**Stack (locked):** Next.js App Router · Clerk · Supabase (Postgres + RLS) · Resend optional for digests  

---

## 1. Problem & goals

### Problem
The club runs relatively few events and sees low member participation. The current public site risks visual and content bloat (particle/connector backgrounds, too many homepage sections), which undercuts professional credibility and does not create a reason for members to return weekly.

### Goals (90-day priority order)
1. **Stronger public story + join funnel** — District, prospects, and outsiders understand who Vishwahita is and how to join.
2. **Members open the site weekly** — A virtual clubroom (ideas + weekly prompt + clear next event).
3. **Higher real-event turnout** — Informed members, simple RSVP, clear upcoming events.
4. **President runs the site** — Admin CMS covers every content type the site displays (no developer for routine edits).

### Non-goals (v1)
- Full social chat / free-form feed on the public site  
- Fake “members online” presence  
- Switching database to Convex  
- Multi-role board permissions beyond admin vs member  
- Heavy gamification, badges, or 3D/particle backgrounds  

---

## 2. Product architecture

Three layers, one brand (Midnight Cranberry & Gold per existing `DESIGN.md`).

| Layer | Route family | Audience | Purpose |
| --- | --- | --- | --- |
| **Public House** | `/`, `/events`, `/projects/*`, `/about` (optional thin), `/contact`, auth | Visitors, prospects, officials | Story, proof, contact, join |
| **Member Clubroom** | `/member` (evolve from `/hub`) | Signed-in members | Participate, RSVP, tutorial, ops |
| **Admin** | `/admin` | `publicMetadata.role === "admin"` | Edit all content types |

**Principle:** Public stays professional and dynamic but **not a dump**. Deep lists live on dedicated pages. Interaction that needs a small club lives **behind login**.

```
Visitor ──► Public pages ──► Join (Clerk) ──► Member clubroom
                                              │
Admin ───────────────────────────────────────► Admin CMS
```

---

## 3. Information architecture

### Public navigation
- **Home**
- **Events** (dropdown or subnav): Club events · Signature projects · Legacy
- **Contact**
- **Member** → sign-in if logged out; clubroom if logged in  
- **Admin** → only when admin role  

### Public routes
| Route | Content |
| --- | --- |
| `/` | Story home (see §4) |
| `/events` | Full club events (upcoming / past / online filters) |
| `/events/[id]` or query deep-link | Single event detail + RSVP if signed in |
| `/projects` | Signature projects index |
| `/projects/[slug]` | Project detail |
| `/projects/legacy` or flag on project | Single **Legacy** flagship project |
| `/milestones` (optional; can be home strip + CMS only) | Timeline milestones |
| `/contact` | Contact + sponsor/District facts |
| `/sign-in`, `/sign-up` | Clerk |

### Member routes
| Route | Content |
| --- | --- |
| `/member` | Clubroom home (dashboard) |
| `/member/events` | RSVP-focused list |
| `/member/participate` | Weekly prompt + idea board |
| `/member/learn` | Onboarding / Rotaract basics |
| Existing `/hub` | **Redirect to `/member`** after cutover (keep temporarily if needed) |

### Admin
| Area | Manages |
| --- | --- |
| Events | CRUD, public flag, online flag, dates, location |
| Projects | Signature list, one Legacy flag, gallery/captions |
| Milestones | Year/title/body/order |
| Announcements | Public/members visibility, pin |
| Page sections | Hero, story, contact blurb, footer |
| Board / contacts | Officers, emails, social |
| Participate | Active weekly prompt; idea statuses |
| Users (light) | Rely on Clerk role for admin; optional member list |

---

## 4. Public homepage UX

**Not everything on one page.** Top and middle hold main attractions; carousels deep-link to full pages.

### First load — logo + name
1. Centered **club logo + “Rotaract Club of Vishwahita”** (and optional District line).  
2. On first scroll (or after ~1.2s if no scroll), mark and name **rise into the sticky nav** — one calm motion.  
3. Respect `prefers-reduced-motion` (instant final nav state).

### Section order (top → bottom)
1. **Hook** — After intro settles: short positioning line + primary CTA **Become a member** + secondary **See events**.  
2. **Story** — 1 short paragraph: charter 10 Mar 1999, sponsor Rotary Club of Madras Industrial City, District 3234, meaning of Vishwahita. Link to more only if needed.  
3. **Next up** — Events **auto-scrolling horizontal strip** (3–6 cards). Click → `/events` or event detail. Not a full grid dump.  
4. **Signature projects** — Carousel (not all projects). Click → `/projects` or slug.  
5. **Legacy spotlight** — **One** best/longest-running project, editorial treatment.  
6. **Milestones** — Compact strip (4–6 points), not a museum.  
7. **Join** — Single clear CTA.  
8. **Contact teaser** — Address/email/president line → `/contact`.  

### Visual rules (public + global)
- **Remove** tsparticles, connecting particle webs, dense fractal noise overlay, childish multi-aura clutter.  
- **Keep** solid midnight paper, cranberry ≤15%, gold sparingly, glass only where useful, restrained hover.  
- No invented metrics. Real numbers only (e.g. charter year, District, member count if president confirms).  
- Typography: Inter + Playfair drama per `DESIGN.md`; avoid sparkle/bounce gimmicks on official chrome.

---

## 5. Events UX

### Types
- **Club events** — meetings, service days, online sessions, fellowship.  
- **Signature projects** — ongoing/recurring programs (may link to project records).  
- **Legacy** — one designated project (not a third calendar type; a project flag).  

### Public
- Teaser carousel on home.  
- `/events`: filters Upcoming | Past | Online; cards with date, title, location/mode, short blurb.  
- Detail: full description; **RSVP** if authenticated; else “Sign in to RSVP”.  

### Member
- Same events with RSVP state, “I’m going” list, reminder of next event on clubroom home.  

### Admin
- Full CRUD; fields: title, description, starts_at, ends_at, location, is_online, is_public, cover optional, linked project optional.

---

## 6. Member clubroom UX

### Clubroom home (`/member`)
- **Next event** + RSVP status  
- **This week’s prompt** (status: answered / not)  
- **Top ideas** (3) + link to board  
- **Pinned announcement** (one)  
- Progress: **Tutorial complete?** banner if not  

### Participate (A + D framed as one space)
**Tabs:**

1. **This week’s prompt**  
   - President publishes one question per week (`pulse` / prompt record).  
   - Members submit one response (and optional short comment).  
   - Low friction habit for quiet clubs.  

2. **Idea board**  
   - Members post ideas (title + short body).  
   - Others **upvote** (one per user).  
   - Optional single-level comment later; v1 can be upvote-only.  
   - President sets status: `new` | `under_review` | `planned` | `done` | `declined`.  

### Learn — new member tutorial
One-time guided checklist (mark complete per step or overall):

1. What is Rotaract?  
2. Why join / benefits for students & young professionals  
3. What members do (service, meetings, District)  
4. How *this* club works (avenues, signature, how to RSVP)  
5. First action: open next event or answer this week’s prompt  

Content is CMS-editable by admin. Completion stored on user profile (`tutorial_completed_at`).

### Soft gate
- Tutorial **encouraged** with banner and checklist.  
- **Not** a hard block on RSVP in v1 (club is low-activity; friction kills turnout). Revisit if president wants hard gate later.

---

## 7. Contact page

- Club email / Instagram / forms as available  
- Meeting city: Chennai · District 3234  
- Sponsor: Rotary Club of Madras Industrial City  
- President / Secretary contact if president approves publishing  
- Simple “Message the club” form → stored in Supabase + optional email to admin (Resend)

---

## 8. Roles & permissions

| Actor | Access |
| --- | --- |
| **Visitor** | All public routes; no RSVP write; no ideas |
| **Member** (Clerk signed-in) | Clubroom; RSVP; ideas + votes; prompt answers; tutorial |
| **Admin** (president / board via Clerk `publicMetadata.role === "admin"`) | All member powers + `/admin` CMS |

**“Edit any column” (v1 interpretation):**  
President can create/update/delete every **content type** that drives the UI (not raw arbitrary HTML injection of every layout pixel). Page sections cover free text for hero/story/contact. New structured fields go through CMS forms.

**Sync:** Continue Clerk → Supabase `users` upsert on authenticated entry (`syncUserToSupabase`).

---

## 9. Data model (Supabase)

Extend existing schema; keep Postgres + RLS. Core entities:

| Table | Purpose | Key fields |
| --- | --- | --- |
| `users` | Members | clerk id, name, email, role, `tutorial_completed_at` |
| `events` | Club events | title, description, starts_at, location, is_online, is_public |
| `event_rsvps` | RSVP | event_id, member_id, status |
| `initiatives` / projects | Signature + legacy | slug, title, category, descriptions, `is_signature`, `is_legacy`, display_order |
| `initiative_gallery` | Project images | urls, captions |
| `milestones` | Timeline | year, title, body, display_order |
| `announcements` | Notices | title, content, visibility, is_pinned |
| `page_sections` | CMS blobs | section_key, content JSON |
| `board_members` | Officers | name, role, order |
| `pulse_forms` / `pulse_responses` | Weekly prompt (D) | week_label, questions/answers, is_active |
| `ideas` | Idea board (A) | author_id, title, body, status, vote_count |
| `idea_votes` | Unique votes | idea_id, member_id UNIQUE |
| `contact_messages` | Contact form | name, email, message, created_at |

**RLS sketch:**
- Public SELECT on public events, signature/legacy projects, public announcements, milestones, page_sections.  
- Authenticated write for own RSVPs, own ideas, own votes, own pulse responses.  
- Admin full write via service role or admin-checked server actions (existing pattern).

**Stack decision:** Stay on **Supabase**. Convex is out of scope unless clubroom later needs always-on multiplayer collaboration.

---

## 10. Admin CMS scope

President can manage:

- Events (all fields + publish flags)  
- Projects (signature list + exactly one `is_legacy = true` enforcement)  
- Milestones  
- Announcements  
- Page sections (hero, story, contact, tutorial copy)  
- Board / contacts  
- Active weekly prompt  
- Idea statuses (moderation)  
- Optional: feature flags for carousels  

Server actions remain `"use server"` + `auth()` guards + `revalidatePath`.

---

## 11. Technical notes

- **Framework:** Next.js 16 App Router, existing component patterns.  
- **Auth:** Clerk; admin via `publicMetadata.role`.  
- **Data:** Supabase anon for public reads; admin client for privileged writes.  
- **Caching:** Public pages `revalidate` ~60s; member/admin dynamic.  
- **Backgrounds:** Remove `CinematicBackground` particle system / connecting webs from root layout; replace with solid theme background (and optional very subtle gradient only if needed). Remove or neutralize global noise if it still reads childish.  
- **Email (phase later):** Weekly digest / event reminder via Resend.  

### Errors & empty states
- Empty events carousel: single card “No upcoming events — check back soon” + link to past.  
- Empty idea board: prompt members to post first idea + link to weekly prompt.  
- Supabase down: graceful empty arrays (existing pattern); no fake stats.  
- RSVP failure: toast + retry; do not double-insert (unique constraint).  

### Testing
- Unit: server action auth guards; idea vote uniqueness; legacy single-flag validation.  
- Component: tutorial checklist complete state; nav Member vs Admin visibility.  
- Smoke: existing vitest suite + critical path sign-in mock.  
- Manual: public home without particles; carousel → events page; admin edit reflects after revalidate.

---

## 12. Build phases

### Phase 0 — Visual calm (immediate, unblocks professionalism)
- Remove particle/connector cinematic background and distracting overlays.  
- Quiet root background; keep brand tokens.  
- Nav cleanup toward public IA (Contact, Member, Events).  

### Phase 1 — Public House (priority #1)
- Homepage restructure per §4 (logo intro, carousels, legacy spotlight, thin story).  
- `/events` full page + home auto-scroll.  
- `/projects` signature + legacy spotlight.  
- `/contact` page.  
- Strip leftover bloat sections from home (affirmation, fake live pulse, membership tier maze, story navigator chrome).  
- **Ambattur-class public parity** (standing strip, board, gallery teaser, avenues tags, prospect join form, honest empty states) — ticket IDs **P0-*** / **P1-*** live in `AGENTS.md` §11a. Phase 2+ must not start until that checklist is green.  

### Phase 2 — Member Clubroom (priority #2–3)
- Rename/redirect hub → `/member`.  
- Clubroom home, RSVP UX, Participate (prompt + ideas), Learn tutorial.  
- Nav shows Member dashboard when signed in.  

### Phase 3 — Admin completeness (priority #4)
- CMS panels for milestones, ideas moderation, legacy flag, contact messages, tutorial copy.  
- Enforce one legacy project.  
- President checklist doc (how to post weekly prompt).  

### Phase 4 — Habit amplifiers (optional)
- Email digest / event reminders.  
- Hard tutorial gate if desired.  
- Light comments on ideas.  

---

## 13. Success metrics (honest, measurable)

| Priority | Signal |
| --- | --- |
| Public story | Join clicks / sign-ups; qualitative District feedback |
| Weekly habit | % members who open clubroom or answer prompt ≥1×/week |
| Turnout | RSVP count vs actual attendance (president-reported) |
| Admin | President updates event without developer help |

No vanity “online now” metrics.

---

## 14. Open decisions (defaults locked unless president overrides)

| Topic | Default |
| --- | --- |
| Tutorial hard gate | Soft only (v1) |
| Idea comments | Off (v1); upvotes on |
| Public announcements page | Optional; pin can live on home/member |
| `/hub` | Redirect to `/member` |
| Database | Supabase remains |

---

## 15. Relationship to prior work

- Homepage “club newspaper” redesign is a **step toward** Phase 1; this spec **supersedes** homepage density and feature set where they conflict.  
- `DESIGN.md` remains the visual system; this spec **removes** particle/childish motion that contradicts professional restraint.  
- Existing tables (events, announcements, initiatives, pulse_*, page_sections) are **extended**, not thrown away.

---

## Approval record

| Section | Status |
| --- | --- |
| Approach 1 (House + Clubroom) | Approved |
| Site map | Approved |
| Roles | Approved |
| Page UX | Approved |
| Visual system | Approved |
| Data / admin / phases | Approved |
| This written spec | **Awaiting user file review** |
