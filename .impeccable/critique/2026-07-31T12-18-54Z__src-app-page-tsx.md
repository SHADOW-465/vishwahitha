---
target: homepage (src/app/page.tsx) post polish quieter
total_score: 29
p0_count: 0
p1_count: 2
timestamp: 2026-07-31T12-18-54Z
slug: src-app-page-tsx
---
# Critique: Homepage after polish + quieter (2026-07-31)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Form pending/status; honest empties |
| 2 | Match System / Real World | 4 | Club-native language; real standing |
| 3 | User Control and Freedom | 3 | Brand intro dismissable; no auth wall on apply |
| 4 | Consistency and Standards | 2→3 | Notices added to nav; Projects still at /initiatives |
| 5 | Error Prevention | 3 | Required fields; empty honest |
| 6 | Recognition Rather Than Recall | 3 | Clear public IA |
| 7 | Flexibility and Efficiency | 3 | Apply without account |
| 8 | Aesthetic and Minimalist Design | 2 | Quieter; residual card monotony |
| 9 | Error Recovery | 3 | Server messages under forms |
| 10 | Help and Documentation | 3 | FAQ embedded in join |
| **Total** | | **29/40** | **Good — was 20/40** |

## Anti-Patterns

LLM: Mostly clean residual SaaS chrome (mono labels, bento themes).
Detector: homepage mount clean []; 9 advisories off-path (toast colors, dead particles, scrollbar). gradient-text fixed on globals; sponsor-showcase hover fixed.

## Priority (post-fix)

P0: none
P1: home story one-liner (partially via hero subtext); /projects alias optional
P2: CMS impact_stat content discipline; bento theme variety
P3: dead component inventory

## What shipped this pass

- Solid gold-text (no gradient clip)
- Unsplash removed public + demos
- Gradient CTAs → solid cranberry/gold
- About stripped vanity demographics
- Page headers quieter
- Notices in nav; standing redundancy trimmed
- Build green
