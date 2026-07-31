---
target: homepage (src/app/page.tsx)
total_score: 20
p0_count: 2
p1_count: 2
timestamp: 2026-07-31T12-06-09Z
slug: src-app-page-tsx
---
# Critique: Homepage public house

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Form feedback OK; bulletin events not links; empty CMS invents GBM; weak post-apply next steps |
| 2 | Match System / Real World | 2 | Real District standing; join product reads Clerk SaaS vs prospect application |
| 3 | User Control and Freedom | 3 | Brand splash blocks ~1.6s with no skip |
| 4 | Consistency and Standards | 1 | Hero Join=/sign-up vs nav Join=/#join vs FAQ account path |
| 5 | Error Prevention | 2 | Dual join paths invite wrong path; stock photo fallbacks fake proof |
| 6 | Recognition Rather Than Recall | 2 | Long same-weight section parade; no in-page story map |
| 7 | Flexibility and Efficiency | 2 | Event sections duplicated; join buried |
| 8 | Aesthetic and Minimalist Design | 1 | ~12 beats, repeated mono eyebrow + glass + drama italic recipe |
| 9 | Error Recovery | 3 | Form messages clear; post-fail guidance thin |
| 10 | Help and Documentation | 2 | FAQ join-focused but contradicts primary CTA |
| **Total** | | **20/40** | **Acceptable — significant improvements needed** |

## Anti-Patterns Verdict

**LLM assessment:** Partial AI-slop. Institutional spine is real (charter, sponsor, District), Phase 0 particles are off, empty states can be honest — but the home still reads as a luxury component catalog: mono eyebrows on nearly every section, formulaic plain+gold-drama H2s, glass-panel default, gradient CTAs, stock Unsplash project fills, hardcoded 35 / 500+ vanity strip, brand splash instead of logo-rise-into-nav.

**Deterministic scan:** Homepage mount tree = 0 detector hits. Shared chrome: gradient-text utilities in globals.css heavily used via `.gold-text` across home headings (under-counted by TSX scan). Orphan particles-background + unused showcase still in tree. Browser visualization skipped (no Puppeteer).

## Overall Impression

Right ingredients under a repetitive high-end skin. Biggest opportunity: one coherent join story + honest proof, then cut half the section parade so motion and hierarchy have room to matter.

## What's Working

1. Official standing (charter 10 Mar 1999, Rotary Madras Industrial City, RI 3234 Group 01)
2. Phase 0 calm shipped — no particles on render path; honest empty gallery/events possible
3. Prospect form without forcing full member product

## Priority Issues

### [P0] Join path is incoherent
Hero Become a member → /sign-up; nav Join Us → /#join; FAQ says create account; join body says prospect form. Fix: primary = prospect form; secondary = member sign-in. Align FAQ + hero.
Suggested: /impeccable clarify + polish

### [P0] Proof can be synthetic
Hardcoded Members 35 / Projects 500+; Unsplash fallbacks on bento/legacy; metadata markets vanity. Fix: CMS-only or omit stats; real photos or empty.
Suggested: /impeccable quieter + distill

### [P1] Homepage is a section parade
~12 peer-weighted beats; events duplicated (bulletin + carousel). Fix: ≤7 beats; kill event dupe; fold mission/milestones; FAQ into join.
Suggested: /impeccable distill + layout

### [P1] Brand intro ≠ logo→nav motion
Full-screen 1600ms splash, not rise-into-nav. Fix: morph into sticky nav or delete splash.
Suggested: /impeccable animate

### [P2] Interaction inconsistency
Bulletin events not links; nav IA desktop≠mobile; footer generic socials/legal #.
Suggested: /impeccable polish

## Persona Red Flags

**Jordan (prospect):** Clerk instead of application; long scroll; conflicting FAQ.
**Casey (mobile):** Forced splash; two event sections; join buried.
**District Official:** Standing good; stock+vanity+SaaS CTAs undermine ops legitimacy.

## Minor Observations

Dual h1 in hero; mission border-l accent; /initiatives vs Projects label; DESIGN.md still documents particles.

## Questions

1. First screen + first scroll: do they know how to show up this month?
2. Premium without mono eyebrows + gold-text + glass for a week?
3. Is Clerk the funnel or the ops door?
4. Which single screen proves the club is alive this term?
