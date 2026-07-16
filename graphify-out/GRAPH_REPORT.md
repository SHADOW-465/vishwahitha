# Graph Report - .  (2026-07-16)

## Corpus Check
- 93 files · ~53,399 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 333 nodes · 362 edges · 56 communities (52 shown, 4 thin omitted)
- Extraction: 84% EXTRACTED · 15% INFERRED · 1% AMBIGUOUS · INFERRED: 54 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Admin Announcement CMS|Admin Announcement CMS]]
- [[_COMMUNITY_Supabase Schema Migrations|Supabase Schema Migrations]]
- [[_COMMUNITY_Clubroom Product Decisions|Clubroom Product Decisions]]
- [[_COMMUNITY_Architecture Priorities Spec|Architecture Priorities Spec]]
- [[_COMMUNITY_Public Home Club Bulletin|Public Home Club Bulletin]]
- [[_COMMUNITY_Nav Design System|Nav Design System]]
- [[_COMMUNITY_Legacy Implementation Plans|Legacy Implementation Plans]]
- [[_COMMUNITY_Theme Hero Navbar Motion|Theme Hero Navbar Motion]]
- [[_COMMUNITY_Brand Tokens Visual Rules|Brand Tokens Visual Rules]]
- [[_COMMUNITY_Club Identity Facts|Club Identity Facts]]
- [[_COMMUNITY_Hub Events Data Layer|Hub Events Data Layer]]
- [[_COMMUNITY_Phase 0 Visual Calm|Phase 0 Visual Calm]]
- [[_COMMUNITY_Honest Content Non-Goals|Honest Content Non-Goals]]
- [[_COMMUNITY_Initiative Cards|Initiative Cards]]
- [[_COMMUNITY_Root Layout Background|Root Layout Background]]
- [[_COMMUNITY_Motion Libraries A11y|Motion Libraries A11y]]
- [[_COMMUNITY_Phase 4 Email Habits|Phase 4 Email Habits]]
- [[_COMMUNITY_Glass Card Design|Glass Card Design]]

## God Nodes (most connected - your core abstractions)
1. `Rotaract Club of Vishwahita` - 11 edges
2. `Supabase (Postgres + RLS)` - 10 edges
3. `Phase 3 Full Feature Expansion Schema` - 9 edges
4. `initiatives` - 9 edges
5. `sanitizePayload()` - 8 edges
6. `Public House` - 7 edges
7. `Brand tokens Midnight Cranberry Gold Ivory` - 7 edges
8. `RLS Admin Role Gate` - 7 edges
9. `useTheme()` - 6 edges
10. `MagneticButton()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `13-Step Implementation Sequence` --references--> `Phase 3 Full Feature Expansion Schema`  [INFERRED]
  docs/plans/2026-02-25-vishwahitha-website-design.md → supabase/migrations/20260225_phase3_schema.sql
- `Users: Active club members & leaders` --semantically_similar_to--> `Member role`  [INFERRED] [semantically similar]
  PRODUCT.md → AGENTS.md
- `Impl Task: Phase 3 Database Migration` --references--> `Phase 3 Full Feature Expansion Schema`  [EXTRACTED]
  docs/plans/2026-02-25-vishwahitha-full-implementation.md → supabase/migrations/20260225_phase3_schema.sql
- `Users: Chennai youth & prospects` --semantically_similar_to--> `Visitor role`  [INFERRED] [semantically similar]
  PRODUCT.md → AGENTS.md
- `Users: Board admin users` --semantically_similar_to--> `Admin role`  [INFERRED] [semantically similar]
  PRODUCT.md → AGENTS.md

## Hyperedges (group relationships)
- **Official House + Clubroom three-layer architecture** — agents_official_house_clubroom, agents_public_house, agents_member_clubroom, agents_admin_cms [EXTRACTED 1.00]
- **Participate space combining idea board and weekly prompt** — agents_participate_space, agents_idea_board, agents_weekly_prompt, agents_member_clubroom [EXTRACTED 1.00]
- **Implementation phases 0–4 ordered rollout** — agents_phase_0_visual_calm, agents_phase_1_public_house, agents_phase_2_member_clubroom, agents_phase_3_admin_completeness, agents_phase_4_habit_amplifiers [EXTRACTED 1.00]
- **Phase 3 CMS Content Model** — phase3_announcements, phase3_initiatives, phase3_initiative_gallery, phase3_pulse_forms, phase3_pulse_responses, phase3_page_sections, phase3_gallery_media [EXTRACTED 1.00]
- **Member Hub Feature Surface** — feature_member_hub_f4, feature_weekly_pulse_f3, feature_announcements_f1, phase2_event_rsvps, phase2_documents, route_hub [EXTRACTED 1.00]
- **Mobile Responsiveness Workstream** — mobile_hamburger_dropdown, mobile_admin_collapsible_sidebar, mobile_hero_typography_scale, mobile_sponsor_fade_masks, mobile_breakpoint_targets, component_navbar, component_admin_shell, component_hero [EXTRACTED 1.00]

## Communities (56 total, 4 thin omitted)

### Community 0 - "Admin Announcement CMS"
Cohesion: 0.08
Nodes (27): handleCreate(), handleDelete(), handleTogglePin(), handleCreate(), handleDelete(), handleCreate(), handleDelete(), handleSave() (+19 more)

### Community 1 - "Supabase Schema Migrations"
Cohesion: 0.09
Nodes (32): Phase 2 Feature Expansion Migration, Board Members Migration, Phase 3 Full Feature Expansion Schema, Announcement Visibility public|members, board_members, AdminShell, Admin CMS Slide-out Drawer, Navbar Announcement Unread Badge (+24 more)

### Community 2 - "Clubroom Product Decisions"
Cohesion: 0.08
Nodes (31): Clerk auth, Convex migration (rejected), Idea board (A), Learn new-member tutorial, Member Clubroom, Next.js App Router stack, Participate space (A + D), Admin role (+23 more)

### Community 3 - "Architecture Priorities Spec"
Cohesion: 0.07
Nodes (29): 90-day success priorities, Admin CMS, 2026-07-16 clubhouse design spec, Legacy spotlight (one flagship project), Logo + name intro into sticky nav, Official House + Clubroom (Approach 1), Phase 1 Public House, Phase 2 Member Clubroom (+21 more)

### Community 4 - "Public Home Club Bulletin"
Cohesion: 0.1
Nodes (10): Home(), FeaturedBento(), WhoWeAre(), InitiativesPage(), getInitiativeBySlug(), getInitiatives(), getPageSection(), getPublicAnnouncements() (+2 more)

### Community 5 - "Nav Design System"
Cohesion: 0.11
Nodes (23): Navbar Component, ProjectShuffler (DB-driven), Floating Pill Navbar, Scroll-Driven Theme Inversion Engine, ThemeProvider, ThemedSection, F7 Enhanced Gallery, F2 Dynamic Initiatives (+15 more)

### Community 6 - "Legacy Implementation Plans"
Cohesion: 0.11
Nodes (21): Vishwahitha Full Implementation Plan, Vishwahitha Website Design Document, Mobile Responsiveness Design, Mobile Responsiveness Implementation Plan, Rotaract Club of Vishwahita, Hero (cinematic), Approach A: Extend & Enrich, Community Luxe positioning (+13 more)

### Community 7 - "Theme Hero Navbar Motion"
Cohesion: 0.13
Nodes (4): useTheme(), MagneticButton(), ParticlesBackground(), ThemedSection()

### Community 8 - "Brand Tokens Visual Rules"
Cohesion: 0.12
Nodes (16): Brand tokens Midnight Cranberry Gold Ivory, DESIGN.md locked visual system, Tone: luxury + editorial, ThemeProvider body[data-theme], Rotaract Cranberry #D41367, Cranberry Focus Rule (≤15%), Creative North Star: Digital Instrument of Leadership, Font Inter (display/body) (+8 more)

### Community 9 - "Club Identity Facts"
Cohesion: 0.18
Nodes (12): Charter 10 March 1999, Rise Above, Unite for Good, RI District 3234, Rotaract Club of Vishwahita, Rotary Club of Madras Industrial City, Vishwahita (universal friendship), 35 club members (2025) (+4 more)

### Community 10 - "Hub Events Data Layer"
Cohesion: 0.36
Nodes (4): EventManager(), HubPage(), getAllAnnouncements(), syncUserToSupabase()

### Community 11 - "Phase 0 Visual Calm"
Cohesion: 0.29
Nodes (7): Phase 0 Visual calm, Remove particle/connector backgrounds, Remove CinematicBackground particles, Magnetic button / CTA, Lucide icons (no emoji-as-UI), GEMINI cinematic landing page builder, Global CSS noise overlay (feTurbulence 0.05)

### Community 12 - "Honest Content Non-Goals"
Cohesion: 0.4
Nodes (5): Honest content rules, v1 non-goals, 15 projects completed (term report), SEO claim: 500+ projects / 2000+ reached, Anti-reference: over-stimulating gamification

### Community 18 - "Motion Libraries A11y"
Cohesion: 0.67
Nodes (3): Framer Motion, GSAP + ScrollTrigger, prefers-reduced-motion respect

## Ambiguous Edges - Review These
- `Remove particle/connector backgrounds` → `Global CSS noise overlay (feTurbulence 0.05)`  [AMBIGUOUS]
  GEMINI.md · relation: conceptually_related_to
- `Honest content rules` → `SEO claim: 500+ projects / 2000+ reached`  [AMBIGUOUS]
  content refernce.md · relation: conceptually_related_to
- `15 projects completed (term report)` → `SEO claim: 500+ projects / 2000+ reached`  [AMBIGUOUS]
  club content.md · relation: conceptually_related_to

## Knowledge Gaps
- **75 isolated node(s):** `RI District 3234`, `Rotary Club of Madras Industrial City`, `Unite for Good`, `Rise Above`, `Convex migration (rejected)` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Remove particle/connector backgrounds` and `Global CSS noise overlay (feTurbulence 0.05)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Honest content rules` and `SEO claim: 500+ projects / 2000+ reached`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `15 projects completed (term report)` and `SEO claim: 500+ projects / 2000+ reached`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Official House + Clubroom (Approach 1)` connect `Architecture Priorities Spec` to `Club Identity Facts`, `Clubroom Product Decisions`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `AnnouncementCard()` connect `Admin Announcement CMS` to `Public Home Club Bulletin`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `RI District 3234`, `Rotary Club of Madras Industrial City`, `Unite for Good` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Announcement CMS` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._