---
name: Rotaract Club of Vishwahita Design System
description: Midnight Cranberry and Gold visual design specifications for District 3234.
colors:
  primary: "#020617"
  accent-gold: "#D4AF37"
  accent-cranberry: "#D41367"
  neutral-bg: "#020617"
  neutral-fg: "#FAF8F5"
  neutral-muted: "#A1A1AA"
  gold-ink: "#E8C766"
  cranberry-ink: "#FF619F"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 0.9
  drama:
    fontFamily: "Playfair Display, serif"
    fontSize: "clamp(3.8rem, 8vw, 9.5rem)"
    fontWeight: 300
    lineHeight: 0.75
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
rounded:
  "2xl": "1.5rem"
  "3xl": "2rem"
  "4xl": "3rem"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent-cranberry}"
    textColor: "{colors.neutral-fg}"
    rounded: "{rounded.4xl}"
    padding: "12px 24px"
  button-magnetic:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-fg}"
    rounded: "{rounded.4xl}"
    padding: "10px 20px"
  card-glass:
    backgroundColor: "rgba(255, 255, 255, 0.08)"
    rounded: "{rounded.3xl}"
    padding: "32px"
---

# Design System: Rotaract Club of Vishwahita

## 1. Overview

**Creative North Star: "The Digital Instrument of Leadership"**

The Rotaract Club of Vishwahita design system is built to convey community action and prestigious heritage through a high-contrast midnight aesthetic. The interface represents a blend of official Rotary credibility and modern, youth-led digital refinement. 

Instead of clean corporate flats or overly playful non-profit illustrations, this visual system embraces deep dark-space structures with glowing light accents, glassmorphic panels, and organic background particles. Motion behaves with intentional ease, mimicking high-end watchmaker ateliers and premium editorial journals.

**Key Characteristics:**
- Deep obsidian backdrop overlays with a subtle global 5% SVG fractal noise layer.
- Rounded container borders ranging from 1.5rem to 3rem for smooth tactile volume.
- Interactive magnetism on clickable elements.
- Clean uppercase monospace indicators to show metadata precision.

## 2. Colors

The color palette is composed of prestigious Rotaract Cranberry, traditional Rotary Gold, and highly structured slate/obsidian grays.

### Primary
- **Midnight Void** (#020617): The base space for the website. Used across all page backgrounds to project a premium, focused atmosphere.

### Secondary
- **Official Rotaract Cranberry** (#D41367): The brand identifier representing Rotaract International (Pantone PMS 214C). Used for primary buttons, active calendar details, and core brand signatures.
- **Rotary Gold** (#D4AF37): The accent color representing fellowship and charter prestige. Used in display headers, spotlight graphics, and active icons.

### Neutral
- **Ivory Cream** (#FAF8F5): Used for high-contrast heading text and primary body copy to maintain readability.
- **Zinc Gray** (#A1A1AA): Used for secondary indicators, sub-labels, and metadata to reduce visual weight.

### Ink vs. surface
`#D4AF37` and `#D41367` are **surface** colours — fills, rules, dots, buttons. At
body size on `#020617` they measure 4.0:1 and 3.6:1, under the AA floor. Text
therefore uses the ink pair:

- **Gold Ink** (`--gold-ink`, #E8C766) — 10.4:1. Every gold *word* on the site.
- **Cranberry Ink** (`--cranberry-ink`, #FF619F) — 6.6:1. Cranberry labels and metadata.

Never set type in the raw surface golds. Both inks flip automatically under
`body[data-theme="light"]`.

### Named Rules
**The Cranberry Focus Rule.** The official brand color (#D41367) is used exclusively as a focal accent on less than 15% of any screen surface to preserve its energetic premium impact.

**No gradient type.** Accent words are solid ink. `background-clip: text` was
removed sitewide: it reads as decoration rather than emphasis, and any browser
that fails the clip renders the headline fully transparent.

## 3. Typography

**Display Font:** Inter (geometric sans-serif)
**Drama Font:** Playfair Display (editorial serif)
**Mono Font:** JetBrains Mono (monospace data)

The pairing blends the structured, geometric precision of Inter with the elegant, italic curves of Playfair Display to create a contrasting, high-prestige editorial layout.

### Scale

One fluid modular scale (ratio 1.25) defined in `globals.css` and exposed as
Tailwind `text-step-*`. Use the steps; don't hand-pick `text-4xl`-style sizes.

| Token | Range | Used for |
|---|---|---|
| `step-5` | 2.75 → 5.5rem | Hero headline, flagship project title |
| `step-4` | 2.25 → 3.75rem | Act-closing headline, big figures |
| `step-3` | 1.875 → 2.75rem | Section headings |
| `step-2` | 1.5 → 2rem | Lead sub-headings |
| `step-1` | 1.25 → 1.5rem | Card/entry titles, lead body |
| `step-0` | 1 → 1.125rem | Body copy |
| `step--1` | 0.8125 → 0.875rem | Secondary copy, links |

**Display ceiling: 5.5rem.** The previous hero ran to 9.5rem, which overflowed
on tablet with real CMS copy and read as shouting rather than leading.

**Letter-spacing floor: -0.035em.** Tighter than that and the extrabold Inter
capitals collide.

- **Body copy is Inter, not mono.** JetBrains Mono is reserved for genuine
  metadata: dates, district codes, counts, and the rail labels. Mono paragraphs
  were the single biggest drag on how the site read.
- **Measure:** body copy is capped at 68ch via the `.measure` utility.

## 3b. Page structure — The Charter Ledger

The homepage is **five acts**, not twelve sections. `ChapterRail` fixes a ledger
down the left edge (xl and up) naming the current act; below xl it degrades to a
1px scroll-progress hairline.

| Act | Contains |
|---|---|
| I · Charter | Hero, then the registry line of institutional facts |
| II · This week | Board announcements, then the events ledger |
| III · The work | Flagship project full-bleed, programme index, contact sheet |
| IV · The club | Mission and Avenues, board portraits, chronology |
| V · Join | FAQ, then the single ask |

### Named Rules

**The rail names the act, so sections don't announce themselves.** Every section
used to open with a 10px uppercase gold kicker. That kicker is now the rail's
job. A section gets a real headline and nothing above it. The one surviving
kicker is the bulletin masthead, because a bulletin genuinely has one.

**Acts breathe unevenly.** `--act-lead` opens an act, `--act-beat` separates
beats inside one, `--act-tight` groups. Uniform `py-24` on every section is what
made a story read as a list.

**Each act gets its own layout logic.** A registry line, a masthead, a scrolling
ledger, a full-bleed plate, a chronology — deliberately not one card grid
repeated. Consistency of voice, not of treatment.

**xl:pl-28 is the ledger gutter.** It keeps content clear of the rail at
1280–1440px. Clearance measured at 1280: 20px.

## 4. Elevation

The system is built on depth, relying on glassmorphic borders and glowing backdrops rather than drop shadows.

### Shadow Vocabulary
- **Spotlight Glow** (radial-gradient(circle 160px at var(--x) var(--y), rgba(201,168,76,0.18), transparent)): Ambient glow that tracks the user's cursor inside glass panels.
- **Ambient Aura** (blur-[120px]): Glowing backdrop spots positioned behind containers to divide structural sections.

### Named Rules
**The Tactile Rest Rule.** Glass panels remain flat at rest with a subtle 1px white/10 border. Lift and glow appear exclusively on hover state as a response to cursor interaction.

## 5. Components

### Buttons
- **Shape:** Perfectly round/pill-shaped (9999px).
- **Primary:** Gradient transition from Cranberry (#D41367) to Gold (#D4AF37) with internal padding (10px 20px) and a subtle scale shift.
- **Magnetic Link:** Outlined outline-white/10 button that lifts (translateY(-2px)) on hover.

### Cards / Containers
- **Corner Style:** Tactile rounded corners (1.5rem to 2.5rem).
- **Background:** Semi-transparent white/8 backdrops with a 24px backdrop blur.
- **Borders:** Thin, high-contrast borders (1px solid rgba(255, 255, 255, 0.08)).

### Inputs / Fields
- **Style:** Flat dark background with a subtle border-white/10 and rounded-2xl (1rem).
- **Focus:** Border transitions smoothly to accent-gold with a soft gold/10 ring.

### Navigation
- **Style:** Pill-shaped floating island horizontally centered. Transitions from transparent to blurred glass-panel on scroll.

## 6. Do's and Don'ts

### Do:
- **Do** map all initiatives and bento grids to the official Avenues of Service.
- **Do** ensure all text elements have at least 4.5:1 contrast against their dark background (using `#FAF8F5` for primary copy).
- **Do** wrap scrolling section boundaries with GSAP Theme Inverters to trigger smooth dark-to-light theme changes.

### Don't:
- **Don't** use standard emojis as icons; always implement clean vector SVGs from the Lucide set.
- **Don't** use side-stripe borders (e.g. `border-left-4`) to highlight card categories.
- **Don't** animate or scale direct image tags on hover; animate container backgrounds instead.
- **Don't** set body copy in JetBrains Mono. Mono is metadata only.
- **Don't** put a small uppercase tracked kicker above a section heading. The rail already says where you are.
- **Don't** reach for a glass card by default. Hairline-divided lists, registry
  rows, and full-bleed plates carry most of the page; the card is right for the
  membership form and little else. Nested cards are always wrong.
- **Don't** gate content visibility on a reveal. `[data-reveal]` elements are
  visible by default; `js-reveal` is only added once JS is running, and a 4s
  failsafe reveals anything the observer missed.
- **Don't** tint a set of items on a rotating accent cycle when the colour
  carries no meaning.
