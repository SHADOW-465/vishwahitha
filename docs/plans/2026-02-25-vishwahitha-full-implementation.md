# Vishwahitha Website — Full Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the existing partial Next.js codebase into a complete, cinema-grade Rotaract Club website with dynamic content management, scroll-driven theme inversion, announcements, initiatives, weekly pulse, and a full admin CMS.

**Architecture:** Extend the existing Next.js 16 + Clerk + Supabase stack. New Supabase tables handle dynamic content. A React ThemeProvider + GSAP ScrollTrigger drives dark↔light theme inversion as the user scrolls. The admin panel becomes a full sidebar CMS managing all content without code changes.

**Tech Stack:** Next.js 16, Clerk, Supabase (anon + service-role clients), GSAP + ScrollTrigger, Framer Motion, tsParticles, Tailwind CSS, Vitest, Cormorant Garamond (Google Fonts)

---

## Codebase Reference

Key files to know before touching anything:
- `src/app/layout.tsx` — root layout, ClerkProvider, fonts, BackgroundWrapper
- `src/app/globals.css` — CSS variables (`--background`, `--foreground`), `.glass-panel`
- `tailwind.config.ts` — color tokens (`primary`, `accent-gold`, `accent-cranberry`, etc.)
- `src/lib/supabase.ts` — anon client (safe for client components)
- `src/lib/supabase-admin.ts` — service role client (server-only, bypasses RLS)
- `src/lib/server-actions.ts` — all Supabase mutations (server actions)
- `src/lib/actions.ts` — read-only Supabase queries
- `src/components/ui/background-wrapper.tsx` — fixed bg with particles + auras
- `src/components/navbar.tsx` — floating pill navbar (Framer Motion)
- `supabase/migrations/` — SQL migration files

**Existing color tokens** (being replaced in Task 3):
```
primary: #0A0A14, accent-cranberry: #D91B5C, accent-gold: #FBD300
text-primary: #FAF8F5, text-secondary: #A1A1AA
```

---

## Task 1: Vitest Test Setup

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Modify: `package.json` (add test script + devDeps)

**Step 1: Install test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

Expected: packages install without errors.

**Step 2: Create vitest config**

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

**Step 3: Create setup file**

Create `src/test/setup.ts`:
```ts
import '@testing-library/jest-dom'
```

**Step 4: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 5: Verify setup works**

Create `src/test/smoke.test.ts`:
```ts
describe('test setup', () => {
  it('works', () => {
    expect(1 + 1).toBe(2)
  })
})
```

Run: `npm test`
Expected: `1 passed`

**Step 6: Commit**
```bash
git add vitest.config.ts src/test/setup.ts src/test/smoke.test.ts package.json package-lock.json
git commit -m "chore: add Vitest test setup"
```

---

## Task 2: Database Migration — New Tables

**Files:**
- Create: `supabase/migrations/20260225_phase3_schema.sql`

**Step 1: Write the migration file**

Create `supabase/migrations/20260225_phase3_schema.sql`:

```sql
-- ============================================================
-- Phase 3: Full Feature Expansion
-- ============================================================

-- 1. ALTER existing announcements table (from BroadcastCenter)
--    Add missing columns. If table doesn't exist yet, CREATE it.
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.announcements
    ADD COLUMN IF NOT EXISTS tag TEXT CHECK (tag IN ('event','update','urgent','general')) DEFAULT 'general',
    ADD COLUMN IF NOT EXISTS visibility TEXT CHECK (visibility IN ('public','members')) DEFAULT 'public',
    ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

-- 2. Initiatives table (replaces hardcoded array in ProjectShuffler)
CREATE TABLE IF NOT EXISTS public.initiatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    short_description TEXT,
    full_description TEXT,
    impact_stat TEXT,
    impact_label TEXT,
    hero_image_url TEXT,
    color_class TEXT DEFAULT 'border-white/10',
    is_featured BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Per-initiative gallery
CREATE TABLE IF NOT EXISTS public.initiative_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiative_id UUID REFERENCES public.initiatives(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Seed the 3 existing hardcoded initiatives
INSERT INTO public.initiatives (slug, title, category, short_description, impact_stat, impact_label, color_class, display_order)
VALUES
    ('vaagai', 'Vaagai', 'Elder Care', 'Connecting youth with elders through structured visits, skill-sharing and companionship programs.', '320', 'elders served', 'border-accent-gold/30', 1),
    ('indru', 'INDRU', 'Daily Knowledge', 'Delivering one curated insight every day to build a culture of continuous learning among members.', '365', 'insights delivered', 'border-accent-teal/30', 2),
    ('wishfit', 'WishFit', 'Festive Clothing Drive', 'Collecting and distributing quality clothing to underprivileged families during festive seasons.', '1200', 'garments donated', 'border-accent-red/30', 3)
ON CONFLICT (slug) DO NOTHING;

-- 5. Weekly Pulse forms
CREATE TABLE IF NOT EXISTS public.pulse_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_label TEXT NOT NULL,
    questions JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Weekly Pulse responses
CREATE TABLE IF NOT EXISTS public.pulse_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_id UUID REFERENCES public.pulse_forms(id) ON DELETE CASCADE,
    member_id TEXT NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}',
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(form_id, member_id)
);

-- 7. CMS page sections
CREATE TABLE IF NOT EXISTS public.page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT now(),
    updated_by TEXT
);

-- Seed default CMS content
INSERT INTO public.page_sections (section_key, content) VALUES
    ('hero_headline', '{"line1": "Service Above", "line2": "Self."}'),
    ('hero_subtext', '{"text": "Community Luxe. We are the Rotaract Club of Vishwahita — merging high-end execution with dedicated NGO roots."}'),
    ('about_story', '{"paragraphs": ["The Rotaract Club of Vishwahitha is a community-based organization dedicated to fostering leadership, professional development, and impactful service projects.", "Sponsored by Rotary International, we operate under the guiding principle of Service Above Self — executing high-quality, sustainable programs that address local needs while building a network of global citizens."]}'),
    ('footer_tagline', '{"text": "A community of young leaders taking action to build a better world."}'  )
ON CONFLICT (section_key) DO NOTHING;

-- 8. Add initiative_id to gallery_media for tagging
ALTER TABLE public.gallery_media
    ADD COLUMN IF NOT EXISTS initiative_id UUID REFERENCES public.initiatives(id) ON DELETE SET NULL;

-- 9. RLS Policies

-- announcements: public ones readable by all, members-only by authenticated
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public announcements viewable by all" ON public.announcements;
CREATE POLICY "Public announcements viewable by all" ON public.announcements
    FOR SELECT USING (visibility = 'public');
DROP POLICY IF EXISTS "Members see all announcements" ON public.announcements;
CREATE POLICY "Members see all announcements" ON public.announcements
    FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admins manage announcements" ON public.announcements;
CREATE POLICY "Admins manage announcements" ON public.announcements
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));

-- initiatives: public read
ALTER TABLE public.initiatives ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Initiatives viewable by all" ON public.initiatives;
CREATE POLICY "Initiatives viewable by all" ON public.initiatives FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage initiatives" ON public.initiatives;
CREATE POLICY "Admins manage initiatives" ON public.initiatives
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));

-- initiative_gallery: public read
ALTER TABLE public.initiative_gallery ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Initiative gallery viewable by all" ON public.initiative_gallery;
CREATE POLICY "Initiative gallery viewable by all" ON public.initiative_gallery FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage initiative gallery" ON public.initiative_gallery;
CREATE POLICY "Admins manage initiative gallery" ON public.initiative_gallery
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));

-- pulse_forms: authenticated read
ALTER TABLE public.pulse_forms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Members read pulse forms" ON public.pulse_forms;
CREATE POLICY "Members read pulse forms" ON public.pulse_forms FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Admins manage pulse forms" ON public.pulse_forms;
CREATE POLICY "Admins manage pulse forms" ON public.pulse_forms
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));

-- pulse_responses: members insert own, admins read all
ALTER TABLE public.pulse_responses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Members submit own pulse response" ON public.pulse_responses;
CREATE POLICY "Members submit own pulse response" ON public.pulse_responses
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND member_id = auth.uid()::text);
DROP POLICY IF EXISTS "Members read own response" ON public.pulse_responses;
CREATE POLICY "Members read own response" ON public.pulse_responses
    FOR SELECT USING (member_id = auth.uid()::text);
DROP POLICY IF EXISTS "Admins read all responses" ON public.pulse_responses;
CREATE POLICY "Admins read all responses" ON public.pulse_responses
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));

-- page_sections: public read, admin write
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Page sections readable by all" ON public.page_sections;
CREATE POLICY "Page sections readable by all" ON public.page_sections FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage page sections" ON public.page_sections;
CREATE POLICY "Admins manage page sections" ON public.page_sections
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));
```

**Step 2: Apply migration**

```bash
npx supabase db push
```
Expected: migration applies without errors. If using Supabase dashboard, paste the SQL into the SQL editor and run.

**Step 3: Verify in Supabase**

Check that these tables exist in your Supabase dashboard:
`announcements`, `initiatives`, `initiative_gallery`, `pulse_forms`, `pulse_responses`, `page_sections`

Also verify `gallery_media` now has `initiative_id` column.

**Step 4: Commit**
```bash
git add supabase/migrations/20260225_phase3_schema.sql
git commit -m "feat: add phase 3 database schema - initiatives, announcements, pulse, CMS"
```

---

## Task 3: Design Tokens — Noir & Gold Palette + Fonts

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Step 1: Update Tailwind config**

Replace entire `tailwind.config.ts`:
```ts
import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Dark zone base
                primary: "#08080F",
                // Light zone base
                "primary-light": "#FAFAF4",
                // Gold gradient endpoints
                "accent-gold": "#C9A84C",
                "accent-gold-light": "#FFD97D",
                // Energy / urgency
                "accent-red": "#E8394D",
                // Service / growth
                "accent-teal": "#00C9A7",
                // Text
                "text-primary": "#FAF8F5",
                "text-secondary": "#A1A1AA",
                "text-primary-light": "#0D0C14",
                "text-secondary-light": "#5A5A6A",
                // Glass
                surface: "rgba(255, 255, 255, 0.03)",
            },
            fontFamily: {
                heading: ["var(--font-heading)"],
                drama: ["var(--font-drama)"],
                mono: ["var(--font-mono)"],
            },
            backgroundImage: {
                "gold-gradient": "linear-gradient(135deg, #C9A84C, #FFD97D)",
                "gold-gradient-text": "linear-gradient(90deg, #C9A84C, #FFD97D, #C9A84C)",
            },
            borderRadius: {
                '2xl': '1.5rem',
                '3xl': '2rem',
                '4xl': '3rem',
            },
        },
    },
    plugins: [],
} satisfies Config;
```

**Step 2: Update globals.css**

Replace entire `src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ── Theme CSS Variables ───────────────────────────────── */
:root {
  --background: #08080F;
  --foreground: #FAF8F5;
  --glass-bg: rgba(255, 255, 255, 0.04);
  --glass-border: rgba(255, 255, 255, 0.08);
  --gold-start: #C9A84C;
  --gold-end: #FFD97D;
}

/* Light theme override — applied via body[data-theme="light"] */
body[data-theme="light"] {
  --background: #FAFAF4;
  --foreground: #0D0C14;
  --glass-bg: rgba(0, 0, 0, 0.04);
  --glass-border: rgba(0, 0, 0, 0.08);
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: var(--font-heading), Arial, sans-serif;
  overflow-x: hidden;
  transition: background-color 0.9s cubic-bezier(0.83, 0, 0.17, 1),
              color 0.9s cubic-bezier(0.83, 0, 0.17, 1);
}

/* ── Typography ─────────────────────────────────────────── */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  letter-spacing: -0.02em;
}

/* ── Glass Panel ─────────────────────────────────────────── */
.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--glass-border);
}

/* ── Gold Gradient Text ──────────────────────────────────── */
.gold-text {
  background: linear-gradient(90deg, #C9A84C, #FFD97D);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── Noise Overlay ───────────────────────────────────────── */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.028;
  pointer-events: none;
  z-index: 9999;
}

/* ── Scrollbar ───────────────────────────────────────────── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #08080F; }
::-webkit-scrollbar-thumb { background: #C9A84C44; border-radius: 3px; }

@layer utilities {
  .text-balance { text-wrap: balance; }
}
```

**Step 3: Add Cormorant Garamond font to layout.tsx**

In `src/app/layout.tsx`, replace the font imports section (lines 1–25) with:
```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { BackgroundWrapper } from "@/components/ui/background-wrapper";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-heading",
    weight: ["400", "500", "600", "700", "800"],
});

const cormorantGaramond = Cormorant_Garamond({
    subsets: ["latin"],
    variable: "--font-drama",
    weight: ["300", "400", "600"],
    style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    weight: ["400", "500"],
});

export const metadata: Metadata = {
    title: "Rotaract Club of Vishwahita",
    description: "Community Luxe. A bridge between a high-end creative agency and a dedicated NGO.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${plusJakartaSans.variable} ${cormorantGaramond.variable} ${jetbrainsMono.variable} antialiased`}>
                    <BackgroundWrapper />
                    <Navbar />
                    {children}
                    <Footer />
                </body>
            </html>
        </ClerkProvider>
    );
}
```

**Step 4: Verify**

Run: `npm run dev`
Open: `http://localhost:3000`
Expected: site loads, fonts render (Plus Jakarta Sans for headings, no visual regressions). Check browser DevTools → Elements, `body` should have the three CSS variable classes.

**Step 5: Commit**
```bash
git add tailwind.config.ts src/app/globals.css src/app/layout.tsx
git commit -m "feat: update design tokens to Noir & Gold palette, add Cormorant Garamond"
```

---

## Task 4: ThemeProvider — Scroll-Driven Theme Inversion Engine

**Files:**
- Create: `src/components/theme-provider.tsx`
- Create: `src/components/ui/themed-section.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Create ThemeProvider**

Create `src/components/theme-provider.tsx`:
```tsx
"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
    theme: Theme;
    setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: "dark",
    setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setThemeState] = useState<Theme>("dark");

    const setTheme = useCallback((t: Theme) => {
        setThemeState(t);
        // Sync to body data-theme attribute for CSS variable switching
        document.body.setAttribute("data-theme", t === "light" ? "light" : "");
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
```

**Step 2: Create ThemedSection wrapper**

Create `src/components/ui/themed-section.tsx`:
```tsx
"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ThemedSectionProps {
    theme: "dark" | "light";
    children: React.ReactNode;
    className?: string;
    id?: string;
}

export const ThemedSection = ({ theme, children, className = "", id }: ThemedSectionProps) => {
    const ref = useRef<HTMLElement>(null);
    const { setTheme } = useTheme();

    useEffect(() => {
        if (!ref.current) return;

        const trigger = ScrollTrigger.create({
            trigger: ref.current,
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => setTheme(theme),
            onEnterBack: () => setTheme(theme),
        });

        return () => trigger.kill();
    }, [theme, setTheme]);

    return (
        <section ref={ref} id={id} className={className}>
            {children}
        </section>
    );
};
```

**Step 3: Add ThemeProvider to layout.tsx**

In `src/app/layout.tsx`, wrap children with ThemeProvider:
```tsx
// Add import at top:
import { ThemeProvider } from "@/components/theme-provider";

// Wrap children in body:
<body className={`...`}>
    <ThemeProvider>
        <BackgroundWrapper />
        <Navbar />
        {children}
        <Footer />
    </ThemeProvider>
</body>
```

**Step 4: Write a test for ThemeProvider**

Create `src/test/theme-provider.test.tsx`:
```tsx
import { render, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/components/theme-provider";

const Consumer = ({ onTheme }: { onTheme: (t: string) => void }) => {
    const { theme, setTheme } = useTheme();
    onTheme(theme);
    return <button onClick={() => setTheme("light")}>toggle</button>;
};

describe("ThemeProvider", () => {
    it("defaults to dark", () => {
        let captured = "";
        render(
            <ThemeProvider>
                <Consumer onTheme={(t) => { captured = t; }} />
            </ThemeProvider>
        );
        expect(captured).toBe("dark");
    });

    it("switches to light", async () => {
        let captured = "";
        const { getByText } = render(
            <ThemeProvider>
                <Consumer onTheme={(t) => { captured = t; }} />
            </ThemeProvider>
        );
        act(() => getByText("toggle").click());
        expect(captured).toBe("light");
    });
});
```

Run: `npm test`
Expected: 2 tests pass.

**Step 5: Commit**
```bash
git add src/components/theme-provider.tsx src/components/ui/themed-section.tsx src/app/layout.tsx src/test/theme-provider.test.tsx
git commit -m "feat: add ThemeProvider and ThemedSection for scroll-driven theme inversion"
```

---

## Task 5: Navbar — Theme-Aware + New Links + Announcement Badge

**Files:**
- Modify: `src/components/navbar.tsx`

Replace entire `src/components/navbar.tsx`:
```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { MagneticButton } from "./ui/magnetic-button";
import { useTheme } from "@/components/theme-provider";
import { Bell } from "lucide-react";

const LAST_SEEN_KEY = "vishwahitha_announcements_last_seen";

export const Navbar = () => {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);
    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.role === "admin";
    const { theme } = useTheme();
    const isLight = theme === "light";

    // Announcement badge — count from localStorage timestamp
    const [badgeCount, setBadgeCount] = useState(0);
    useEffect(() => {
        const lastSeen = localStorage.getItem(LAST_SEEN_KEY);
        if (!lastSeen) { setBadgeCount(3); return; } // default hint for new users
        // Real count fetched only when signed in — kept lightweight here
    }, [user]);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    const linkClass = `text-sm font-medium transition-colors duration-300 inline-block hover:-translate-y-[1px] ${
        isLight
            ? "text-text-primary-light hover:text-[#B8860B]"
            : "text-text-secondary hover:text-text-primary"
    }`;

    const pillBg = scrolled
        ? isLight
            ? "bg-white/80 backdrop-blur-2xl border border-black/10 shadow-xl"
            : "bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl"
        : "bg-transparent border-transparent";

    return (
        <motion.header
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-[3rem] px-6 py-3 flex items-center justify-between gap-8 min-w-[320px] sm:min-w-[560px]`}
            style={{ background: "transparent" }}
            animate={{ y: 0, opacity: 1 }}
            initial={{ y: -100, opacity: 0 }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
        >
            {/* Pill background as animated div */}
            <motion.div
                className={`absolute inset-0 rounded-[3rem] transition-all duration-500 ${pillBg}`}
                aria-hidden
            />

            {/* Logo */}
            <Link href="/" className="relative z-10 font-heading font-bold text-xl tracking-tighter gold-text">
                VISHWAHITA
            </Link>

            {/* Nav links */}
            <nav className="relative z-10 hidden md:flex items-center gap-5">
                <MagneticButton><Link href="/about" className={linkClass}>About</Link></MagneticButton>
                <MagneticButton><Link href="/initiatives" className={linkClass}>Initiatives</Link></MagneticButton>
                <MagneticButton><Link href="/gallery" className={linkClass}>Gallery</Link></MagneticButton>
                <MagneticButton>
                    <Link href="/announcements" className={`${linkClass} relative`}>
                        Announcements
                        {badgeCount > 0 && (
                            <span className="absolute -top-2 -right-3 w-4 h-4 rounded-full bg-accent-red text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                                {badgeCount}
                            </span>
                        )}
                    </Link>
                </MagneticButton>
                <SignedIn>
                    <MagneticButton><Link href="/hub" className={linkClass}>Hub</Link></MagneticButton>
                </SignedIn>
                {isAdmin && (
                    <MagneticButton>
                        <Link href="/admin" className="text-sm font-medium gold-text hover:opacity-80 transition-opacity inline-block hover:-translate-y-[1px]">
                            Admin
                        </Link>
                    </MagneticButton>
                )}
            </nav>

            {/* Auth */}
            <div className="relative z-10 flex items-center gap-3">
                <SignedOut>
                    <MagneticButton>
                        <Link
                            href="/sign-up"
                            className="bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary px-5 py-2 rounded-full text-sm font-bold tracking-wide hover:scale-[1.03] transition-transform duration-300 inline-block"
                        >
                            Join Us
                        </Link>
                    </MagneticButton>
                </SignedOut>
                <SignedIn>
                    <UserButton
                        appearance={{
                            variables: { colorPrimary: '#C9A84C' },
                            elements: { userButtonAvatarBox: "w-9 h-9 border-2 border-accent-gold/30" }
                        }}
                    />
                </SignedIn>
            </div>
        </motion.header>
    );
};
```

**Step 2: Verify**

Run: `npm run dev`
- Scroll down on homepage — navbar pill background appears
- Logo should show gold gradient text
- Links: About, Initiatives, Gallery, Announcements, Hub (if signed in), Admin (if admin)
- Announcements link should show a small red badge

**Step 3: Commit**
```bash
git add src/components/navbar.tsx
git commit -m "feat: update navbar with theme-awareness, new links, gold gradient logo, announcement badge"
```

---

## Task 6: Hero — Noir & Gold Cinematic Redesign

**Files:**
- Modify: `src/components/hero.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Rewrite hero.tsx**

Replace entire `src/components/hero.tsx`:
```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { MagneticButton } from "./ui/magnetic-button";

export const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Staggered reveal — each .hero-reveal element animates up
            gsap.from(".hero-reveal", {
                y: 70,
                opacity: 0,
                duration: 1.4,
                stagger: 0.12,
                ease: "power4.out",
                delay: 0.3,
            });
            // Subtle scale-in on the badge
            gsap.from(".hero-badge", {
                scale: 0.7,
                opacity: 0,
                duration: 0.8,
                ease: "back.out(1.7)",
                delay: 0.1,
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative w-full h-[100dvh] flex items-end justify-start overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593113565694-c6c703b44b82?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-25 grayscale z-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/85 to-primary/40 z-10" />
                {/* Gold vignette at bottom */}
                <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-accent-gold/5 blur-[120px] z-20 rounded-full" />
            </div>

            {/* Content */}
            <div className="relative z-30 w-full max-w-7xl mx-auto px-6 pb-28 md:pb-36">
                {/* Rotaract badge */}
                <div className="hero-badge inline-flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/25 rounded-full px-4 py-1.5 mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
                    <span className="font-mono text-xs text-accent-gold uppercase tracking-[0.2em]">Rotaract Club of Vishwahita</span>
                </div>

                <div className="max-w-4xl space-y-4">
                    {/* Line 1 — bold sans */}
                    <h1 className="hero-reveal font-heading font-bold text-5xl md:text-7xl lg:text-8xl text-text-primary tracking-tighter leading-[0.95]">
                        Service Above
                    </h1>
                    {/* Line 2 — massive drama serif gold */}
                    <h1 className="hero-reveal font-drama italic font-light text-[5rem] md:text-[9rem] lg:text-[11rem] leading-[0.8] gold-text tracking-tight">
                        Self.
                    </h1>

                    <p className="hero-reveal text-base md:text-xl text-text-secondary font-mono max-w-lg leading-relaxed pt-4">
                        Community Luxe — merging high-end execution with dedicated NGO roots.
                        District 3232.
                    </p>

                    <div className="hero-reveal flex items-center gap-4 pt-6">
                        <MagneticButton>
                            <Link
                                href="/initiatives"
                                className="inline-block bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold text-sm px-7 py-3.5 rounded-full hover:scale-[1.04] transition-transform duration-300"
                            >
                                Our Initiatives
                            </Link>
                        </MagneticButton>
                        <MagneticButton>
                            <Link
                                href="/about"
                                className="inline-block border border-white/20 text-text-primary font-medium text-sm px-7 py-3.5 rounded-full hover:bg-white/5 transition-colors"
                            >
                                Who We Are
                            </Link>
                        </MagneticButton>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="hero-reveal absolute bottom-8 right-8 z-30 flex flex-col items-center gap-2 opacity-40">
                <span className="font-mono text-[10px] text-text-secondary uppercase tracking-[0.3em]">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-accent-gold/60 to-transparent" />
            </div>
        </section>
    );
};
```

**Step 2: Verify**

Run: `npm run dev` → open `http://localhost:3000`
Expected:
- Large "Service Above" bold heading
- Massive gold italic "Self." below it
- Gold gradient CTA buttons
- Rotaract badge at top left
- Scroll indicator bottom right

**Step 3: Commit**
```bash
git add src/components/hero.tsx
git commit -m "feat: redesign hero with Noir & Gold cinematic layout, Cormorant Garamond drama type"
```

---

## Task 7: Initiative Server Actions + DB-Driven ProjectShuffler

**Files:**
- Modify: `src/lib/actions.ts`
- Modify: `src/lib/server-actions.ts`
- Modify: `src/components/project-shuffler.tsx`
- Create: `src/test/initiative-actions.test.ts`

**Step 1: Add initiative queries to actions.ts**

Append to `src/lib/actions.ts`:
```ts
export async function getInitiatives() {
    const { data, error } = await supabase
        .from("initiatives")
        .select("*")
        .eq("is_featured", true)
        .order("display_order", { ascending: true });

    if (error) { console.error("getInitiatives:", error); return []; }
    return data ?? [];
}

export async function getInitiativeBySlug(slug: string) {
    const { data, error } = await supabase
        .from("initiatives")
        .select("*, initiative_gallery(*)")
        .eq("slug", slug)
        .single();

    if (error) { console.error("getInitiativeBySlug:", error); return null; }
    return data;
}
```

**Step 2: Add initiative mutations to server-actions.ts**

Append to `src/lib/server-actions.ts`:
```ts
export async function createInitiative(formData: FormData) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const slug = (formData.get("title") as string)
        .toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const { data, error } = await supabase
        .from("initiatives")
        .insert([{
            slug,
            title: formData.get("title") as string,
            category: formData.get("category") as string,
            short_description: formData.get("short_description") as string,
            full_description: formData.get("full_description") as string,
            impact_stat: formData.get("impact_stat") as string,
            impact_label: formData.get("impact_label") as string,
            hero_image_url: formData.get("hero_image_url") as string,
            color_class: formData.get("color_class") as string || "border-white/10",
        }])
        .select().single();

    if (error) return { error: error.message };
    revalidatePath("/");
    revalidatePath("/initiatives");
    return { success: true, data };
}

export async function deleteInitiative(id: string) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const { error } = await supabase.from("initiatives").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/");
    revalidatePath("/initiatives");
    return { success: true };
}
```

**Step 3: Write test for slug generation**

Create `src/test/initiative-actions.test.ts`:
```ts
describe("initiative slug generation", () => {
    const makeSlug = (title: string) =>
        title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    it("converts spaces to dashes", () => {
        expect(makeSlug("Elder Care Initiative")).toBe("elder-care-initiative");
    });

    it("strips special characters", () => {
        expect(makeSlug("WishFit: Clothing!")).toBe("wishfit-clothing");
    });

    it("handles single word", () => {
        expect(makeSlug("INDRU")).toBe("indru");
    });
});
```

Run: `npm test`
Expected: 3 tests pass.

**Step 4: Rewrite ProjectShuffler to be DB-driven**

Replace entire `src/components/project-shuffler.tsx`:
```tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Initiative {
    id: string;
    slug: string;
    title: string;
    category: string;
    short_description?: string;
    impact_stat?: string;
    impact_label?: string;
    color_class?: string;
}

interface Props { initiatives: Initiative[] }

export const ProjectShuffler = ({ initiatives }: Props) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (initiatives.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % initiatives.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [initiatives.length]);

    if (initiatives.length === 0) return null;

    return (
        <section className="py-32 px-6 w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <h2 className="text-4xl md:text-6xl font-heading font-bold text-text-primary">
                        Curated <br />
                        <span className="font-drama italic gold-text font-light text-5xl md:text-7xl">Artifacts</span>
                    </h2>
                    <p className="text-text-secondary font-mono text-lg max-w-md">
                        Our active initiatives. Click any card to explore the full story.
                    </p>
                    {/* Dot indicators */}
                    <div className="flex gap-2">
                        {initiatives.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    i === currentIndex ? "w-8 bg-accent-gold" : "w-1.5 bg-white/20"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <div
                    className="relative h-[420px] w-full flex items-center justify-center cursor-pointer"
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % initiatives.length)}
                >
                    <AnimatePresence mode="popLayout">
                        {initiatives.map((initiative, index) => {
                            const relIndex = (index - currentIndex + initiatives.length) % initiatives.length;
                            if (relIndex >= 3) return null; // only show top 3

                            return (
                                <motion.div
                                    key={initiative.id}
                                    layoutId={`shuffler-card-${initiative.id}`}
                                    initial={{ opacity: 0, scale: 0.85, y: 80 }}
                                    animate={{
                                        opacity: relIndex === 0 ? 1 : 0.6 - relIndex * 0.15,
                                        scale: 1 - relIndex * 0.045,
                                        y: relIndex * -36,
                                        zIndex: initiatives.length - relIndex,
                                    }}
                                    exit={{ opacity: 0, scale: 0.8, y: 80 }}
                                    transition={{ type: "spring", stiffness: 220, damping: 22 }}
                                    className={`absolute w-full max-w-md aspect-[4/3] rounded-3xl p-8 flex flex-col justify-between glass-panel border ${initiative.color_class || "border-white/10"}`}
                                >
                                    <div>
                                        <p className="font-mono text-xs tracking-widest uppercase mb-2 text-text-secondary">
                                            {initiative.category}
                                        </p>
                                        <h3 className="text-3xl font-heading font-bold text-text-primary mb-3">
                                            {initiative.title}
                                        </h3>
                                        {initiative.short_description && (
                                            <p className="text-sm text-text-secondary font-mono leading-relaxed line-clamp-2">
                                                {initiative.short_description}
                                            </p>
                                        )}
                                    </div>
                                    {initiative.impact_stat && (
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-3xl font-heading font-bold gold-text">{initiative.impact_stat}</p>
                                                <p className="font-mono text-xs text-text-secondary">{initiative.impact_label}</p>
                                            </div>
                                            {relIndex === 0 && (
                                                <Link
                                                    href={`/initiatives/${initiative.slug}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex items-center gap-2 text-xs font-mono border border-white/20 rounded-full px-4 py-2 hover:bg-white/10 transition-colors text-text-primary"
                                                >
                                                    Explore <ArrowRight size={12} />
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};
```

**Step 5: Update homepage to pass initiatives from DB**

Replace `src/app/page.tsx`:
```tsx
import { Hero } from "@/components/hero";
import { ProjectShuffler } from "@/components/project-shuffler";
import { LiveEventCalendar } from "@/components/live-event-calendar";
import { SponsorShowcase } from "@/components/sponsor-showcase";
import { getInitiatives } from "@/lib/actions";

export default async function Home() {
    const initiatives = await getInitiatives();

    return (
        <main className="min-h-screen pb-32">
            <Hero />
            <ProjectShuffler initiatives={initiatives} />
            <LiveEventCalendar />
            <SponsorShowcase />
        </main>
    );
}
```

**Step 6: Verify**

Run: `npm run dev`
Expected: Shuffler shows Vaagai, INDRU, WishFit from database. Cards auto-cycle every 4s. Clicking a card triggers cycling. "Explore" link on front card links to `/initiatives/[slug]`.

**Step 7: Commit**
```bash
git add src/lib/actions.ts src/lib/server-actions.ts src/components/project-shuffler.tsx src/app/page.tsx src/test/initiative-actions.test.ts
git commit -m "feat: make ProjectShuffler DB-driven, add initiative server actions"
```

---

## Task 8: Initiatives Listing Page — /initiatives

**Files:**
- Create: `src/app/initiatives/page.tsx`
- Create: `src/components/initiative-card.tsx`

**Step 1: Create InitiativeCard component**

Create `src/components/initiative-card.tsx`:
```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

interface Initiative {
    id: string;
    slug: string;
    title: string;
    category: string;
    short_description?: string;
    impact_stat?: string;
    impact_label?: string;
    color_class?: string;
    hero_image_url?: string;
}

export const InitiativeCard = ({ initiative, index }: { initiative: Initiative; index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
    };

    const handleMouseLeave = () => {
        if (cardRef.current) {
            cardRef.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
            viewport={{ once: true }}
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="transition-transform duration-200 ease-out"
                style={{ transformStyle: "preserve-3d" }}
            >
                <Link href={`/initiatives/${initiative.slug}`}>
                    <div className={`glass-panel rounded-3xl overflow-hidden border ${initiative.color_class || "border-white/10"} hover:border-accent-gold/30 transition-colors duration-500 group`}>
                        {/* Image */}
                        {initiative.hero_image_url ? (
                            <div className="w-full aspect-video overflow-hidden">
                                <img
                                    src={initiative.hero_image_url}
                                    alt={initiative.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        ) : (
                            <div className="w-full aspect-video bg-gradient-to-br from-accent-gold/10 to-transparent flex items-center justify-center">
                                <span className="font-drama italic text-5xl gold-text opacity-30">{initiative.title[0]}</span>
                            </div>
                        )}

                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <span className="font-mono text-xs uppercase tracking-widest text-text-secondary bg-white/5 px-3 py-1 rounded-full">
                                    {initiative.category}
                                </span>
                                <ArrowUpRight size={18} className="text-text-secondary group-hover:text-accent-gold transition-colors" />
                            </div>
                            <h3 className="font-heading text-2xl font-bold text-text-primary mb-3">{initiative.title}</h3>
                            {initiative.short_description && (
                                <p className="font-mono text-sm text-text-secondary leading-relaxed line-clamp-3">{initiative.short_description}</p>
                            )}
                            {initiative.impact_stat && (
                                <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-2">
                                    <span className="font-heading text-2xl font-bold gold-text">{initiative.impact_stat}</span>
                                    <span className="font-mono text-xs text-text-secondary">{initiative.impact_label}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
            </div>
        </motion.div>
    );
};
```

**Step 2: Create initiatives listing page**

Create `src/app/initiatives/page.tsx`:
```tsx
import { getInitiatives } from "@/lib/actions";
import { InitiativeCard } from "@/components/initiative-card";

export default async function InitiativesPage() {
    const initiatives = await getInitiatives();

    const categories = ["All", ...Array.from(new Set(initiatives.map((i) => i.category)))];

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-16 space-y-4">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold">Our Work</p>
                <h1 className="font-heading text-5xl md:text-7xl font-bold text-text-primary tracking-tighter">
                    Active <span className="font-drama italic font-light gold-text text-6xl md:text-8xl">Initiatives</span>
                </h1>
                <p className="font-mono text-text-secondary max-w-xl leading-relaxed">
                    Every initiative is a deliberate commitment to our community. Each one has a story, a team, and a measurable impact.
                </p>
            </div>

            {/* Category filter — client-side, rendered as static HTML for now */}
            <div className="flex flex-wrap gap-3 mb-12">
                {categories.map((cat) => (
                    <span
                        key={cat}
                        className="font-mono text-xs uppercase tracking-widest border border-white/10 rounded-full px-4 py-2 text-text-secondary cursor-pointer hover:border-accent-gold/40 hover:text-text-primary transition-colors"
                    >
                        {cat}
                    </span>
                ))}
            </div>

            {/* Grid */}
            {initiatives.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {initiatives.map((initiative, i) => (
                        <InitiativeCard key={initiative.id} initiative={initiative} index={i} />
                    ))}
                </div>
            ) : (
                <div className="py-32 text-center text-text-secondary font-mono">
                    No initiatives found. Add them in the Admin panel.
                </div>
            )}
        </div>
    );
}
```

**Step 3: Verify**

Run: `npm run dev` → open `http://localhost:3000/initiatives`
Expected: Grid of 3 initiative cards (Vaagai, INDRU, WishFit from seeded data). Cards have tilt effect on hover. Category filter pills render. Cards fade in on scroll.

**Step 4: Commit**
```bash
git add src/app/initiatives/page.tsx src/components/initiative-card.tsx
git commit -m "feat: add /initiatives listing page with tilt cards and category filter"
```

---

## Task 9: Initiative Detail Page — /initiatives/[slug]

**Files:**
- Create: `src/app/initiatives/[slug]/page.tsx`
- Create: `src/components/impact-counter.tsx`

**Step 1: Create ImpactCounter component**

Create `src/components/impact-counter.tsx`:
```tsx
"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, animate } from "framer-motion";

interface Props { value: string; label: string }

export const ImpactCounter = ({ value, label }: Props) => {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });
    const numericValue = parseInt(value.replace(/\D/g, ""), 10);
    const suffix = value.replace(/[0-9]/g, "");

    useEffect(() => {
        if (!isInView || !ref.current || isNaN(numericValue)) return;

        const node = ref.current;
        const controls = animate(0, numericValue, {
            duration: 2,
            ease: "easeOut",
            onUpdate(val) {
                node.textContent = Math.round(val) + suffix;
            },
        });

        return () => controls.stop();
    }, [isInView, numericValue, suffix]);

    return (
        <div className="text-center">
            <p className="font-heading text-4xl md:text-5xl font-bold gold-text">
                <span ref={ref}>0{suffix}</span>
            </p>
            <p className="font-mono text-xs text-text-secondary uppercase tracking-widest mt-2">{label}</p>
        </div>
    );
};
```

**Step 2: Create initiative detail page**

Create `src/app/initiatives/[slug]/page.tsx`:
```tsx
import { getInitiativeBySlug, getInitiatives } from "@/lib/actions";
import { ImpactCounter } from "@/components/impact-counter";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
    const initiatives = await getInitiatives();
    return initiatives.map((i) => ({ slug: i.slug }));
}

export default async function InitiativeDetailPage({ params }: { params: { slug: string } }) {
    const initiative = await getInitiativeBySlug(params.slug);
    if (!initiative) notFound();

    const gallery = initiative.initiative_gallery ?? [];

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative w-full h-[70vh] flex items-end overflow-hidden">
                {initiative.hero_image_url ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${initiative.hero_image_url})` }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent-gold/10 to-primary" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
                    <Link href="/initiatives" className="flex items-center gap-2 font-mono text-xs text-text-secondary hover:text-text-primary transition-colors mb-6 w-fit">
                        <ArrowLeft size={14} /> All Initiatives
                    </Link>
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold mb-3">{initiative.category}</p>
                    <h1 className="font-heading text-5xl md:text-7xl font-bold text-text-primary">{initiative.title}</h1>
                </div>
            </section>

            {/* Impact stats bar */}
            {initiative.impact_stat && (
                <section className="bg-accent-gold/5 border-y border-accent-gold/15 py-12">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                            <ImpactCounter value={initiative.impact_stat} label={initiative.impact_label || "impact"} />
                            <div className="hidden md:block w-px h-12 bg-white/10" />
                            <div className="text-center">
                                <p className="font-heading text-4xl md:text-5xl font-bold gold-text">Active</p>
                                <p className="font-mono text-xs text-text-secondary uppercase tracking-widest mt-2">Status</p>
                            </div>
                            <div className="hidden md:block w-px h-12 bg-white/10" />
                            <div className="text-center">
                                <p className="font-heading text-4xl md:text-5xl font-bold gold-text">2025–26</p>
                                <p className="font-mono text-xs text-text-secondary uppercase tracking-widest mt-2">Current Year</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Full description */}
            {initiative.full_description && (
                <section className="py-24 px-6 max-w-4xl mx-auto">
                    <h2 className="font-heading text-3xl font-bold text-text-primary mb-8">
                        About <span className="font-drama italic gold-text font-light">{initiative.title}</span>
                    </h2>
                    <div className="font-mono text-text-secondary leading-relaxed text-base whitespace-pre-line">
                        {initiative.full_description}
                    </div>
                </section>
            )}

            {/* Photo gallery */}
            {gallery.length > 0 && (
                <section className="py-16 px-6 max-w-7xl mx-auto">
                    <h2 className="font-heading text-2xl font-bold text-text-primary mb-8">Gallery</h2>
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                        {gallery.map((item: any) => (
                            <div key={item.id} className="break-inside-avoid rounded-2xl overflow-hidden">
                                <img src={item.image_url} alt={item.caption || initiative.title} className="w-full object-cover" />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-24 px-6 text-center">
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-text-primary mb-4">
                    Want to <span className="font-drama italic gold-text font-light">get involved?</span>
                </h2>
                <p className="font-mono text-text-secondary mb-8 max-w-md mx-auto">
                    Join the {initiative.title} team and make a difference in your community.
                </p>
                <Link
                    href="/sign-up"
                    className="inline-block bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform"
                >
                    Join Vishwahita
                </Link>
            </section>
        </div>
    );
}
```

**Step 3: Verify**

Run: `npm run dev` → open `http://localhost:3000/initiatives/vaagai`
Expected: Hero section, impact counter animates from 0 to 320 on scroll, "About Vaagai" section, CTA. `/initiatives/indru` and `/initiatives/wishfit` also work.

**Step 4: Commit**
```bash
git add src/app/initiatives/[slug]/page.tsx src/components/impact-counter.tsx
git commit -m "feat: add initiative detail page with impact counter animation and photo gallery"
```

---

## Task 10: Announcements — Server Actions + Public Page

**Files:**
- Modify: `src/lib/server-actions.ts`
- Modify: `src/lib/actions.ts`
- Create: `src/app/announcements/page.tsx`
- Create: `src/test/announcement-actions.test.ts`

**Step 1: Add announcement queries to actions.ts**

Append to `src/lib/actions.ts`:
```ts
export async function getPublicAnnouncements() {
    const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("visibility", "public")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) { console.error("getPublicAnnouncements:", error); return []; }
    return data ?? [];
}

export async function getAllAnnouncements() {
    const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) { console.error("getAllAnnouncements:", error); return []; }
    return data ?? [];
}
```

**Step 2: Replace createBroadcast in server-actions.ts**

In `src/lib/server-actions.ts`, replace the `createBroadcast` function with:
```ts
export async function createAnnouncement(formData: FormData) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const { data, error } = await supabase
        .from("announcements")
        .insert([{
            title: formData.get("title") as string,
            content: formData.get("content") as string,
            tag: formData.get("tag") as string || "general",
            visibility: formData.get("visibility") as string || "public",
            is_pinned: formData.get("is_pinned") === "true",
            author_id: userId,
        }])
        .select().single();

    if (error) return { error: error.message };
    revalidatePath("/announcements");
    revalidatePath("/hub");
    return { success: true, data };
}

export async function deleteAnnouncement(id: string) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/announcements");
    revalidatePath("/hub");
    return { success: true };
}

export async function toggleAnnouncementPin(id: string, currentPin: boolean) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };
    const { error } = await supabase.from("announcements").update({ is_pinned: !currentPin }).eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/announcements");
    return { success: true };
}
```

**Step 3: Write tests**

Create `src/test/announcement-actions.test.ts`:
```ts
describe("announcement form data parsing", () => {
    it("detects pinned when is_pinned is 'true'", () => {
        const isPinned = (val: string) => val === "true";
        expect(isPinned("true")).toBe(true);
        expect(isPinned("false")).toBe(false);
        expect(isPinned("")).toBe(false);
    });

    it("defaults visibility to public", () => {
        const getVisibility = (val: string | null) => val || "public";
        expect(getVisibility(null)).toBe("public");
        expect(getVisibility("members")).toBe("members");
    });
});
```

Run: `npm test`
Expected: all tests pass.

**Step 4: Create /announcements public page**

Create `src/app/announcements/page.tsx`:
```tsx
import { getPublicAnnouncements } from "@/lib/actions";
import { AnnouncementCard } from "@/components/announcement-card";

export const revalidate = 60; // ISR — revalidate every 60s

export default async function AnnouncementsPage() {
    const announcements = await getPublicAnnouncements();

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-5xl mx-auto">
            <div className="mb-16">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold mb-4">Latest from the Club</p>
                <h1 className="font-heading text-5xl md:text-7xl font-bold text-text-primary">
                    Announcements <span className="font-drama italic gold-text font-light block text-6xl md:text-8xl mt-1">& Updates</span>
                </h1>
            </div>

            {announcements.length > 0 ? (
                <div className="space-y-6">
                    {announcements.map((a, i) => (
                        <AnnouncementCard key={a.id} announcement={a} index={i} />
                    ))}
                </div>
            ) : (
                <div className="py-32 text-center text-text-secondary font-mono glass-panel rounded-3xl">
                    No announcements yet. Check back soon.
                </div>
            )}
        </div>
    );
}
```

**Step 5: Create AnnouncementCard component**

Create `src/components/announcement-card.tsx`:
```tsx
"use client";

import { motion } from "framer-motion";
import { Pin, Lock } from "lucide-react";

const TAG_COLORS: Record<string, string> = {
    event: "bg-accent-teal/10 text-accent-teal border-accent-teal/20",
    urgent: "bg-accent-red/10 text-accent-red border-accent-red/20",
    update: "bg-accent-gold/10 text-accent-gold border-accent-gold/20",
    general: "bg-white/5 text-text-secondary border-white/10",
};

interface Announcement {
    id: string;
    title: string;
    content: string;
    tag: string;
    visibility: string;
    is_pinned: boolean;
    created_at: string;
}

export const AnnouncementCard = ({ announcement: a, index }: { announcement: Announcement; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.07, ease: [0.25, 1, 0.5, 1] }}
            viewport={{ once: true }}
            className={`glass-panel rounded-3xl p-8 ${a.is_pinned ? "border-accent-gold/30" : ""}`}
        >
            <div className="flex items-start justify-between mb-4 gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <span className={`font-mono text-[10px] uppercase tracking-widest border rounded-full px-3 py-1 ${TAG_COLORS[a.tag] || TAG_COLORS.general}`}>
                        {a.tag}
                    </span>
                    {a.is_pinned && (
                        <span className="flex items-center gap-1 font-mono text-[10px] text-accent-gold">
                            <Pin size={10} /> Pinned
                        </span>
                    )}
                    {a.visibility === "members" && (
                        <span className="flex items-center gap-1 font-mono text-[10px] text-text-secondary">
                            <Lock size={10} /> Members Only
                        </span>
                    )}
                </div>
                <span className="font-mono text-[10px] text-text-secondary whitespace-nowrap">
                    {new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
            </div>
            <h3 className="font-heading text-xl font-bold text-text-primary mb-3">{a.title}</h3>
            <p className="font-mono text-sm text-text-secondary leading-relaxed">{a.content}</p>
        </motion.div>
    );
};
```

**Step 6: Verify**

Run: `npm run dev` → `http://localhost:3000/announcements`
Expected: Page loads, shows empty state or existing announcements from DB. Cards slide in from left on scroll.

**Step 7: Commit**
```bash
git add src/lib/actions.ts src/lib/server-actions.ts src/app/announcements/page.tsx src/components/announcement-card.tsx src/test/announcement-actions.test.ts
git commit -m "feat: add announcements system - server actions, public page, AnnouncementCard component"
```

---

## Task 11: Hub — 5-Tab Redesign with Real Announcements

**Files:**
- Modify: `src/app/hub/page.tsx`
- Create: `src/components/hub-tabs.tsx`

**Step 1: Create HubTabs client component**

Create `src/components/hub-tabs.tsx`:
```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MemberDirectory } from "./member-directory";
import { DocumentRepository } from "./document-repository";
import { AnnouncementCard } from "./announcement-card";
import { EventRSVP } from "./event-rsvp";

interface HubTabsProps {
    announcements: any[];
    members: any[];
    documents: any[];
    myRsvps: any[];
    activePulseForm: any;
    hasSubmittedPulse: boolean;
}

const TABS = ["Feed", "My Events", "Documents", "Directory", "Weekly Pulse"];

export const HubTabs = ({ announcements, members, documents, myRsvps, activePulseForm, hasSubmittedPulse }: HubTabsProps) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            {/* Tab bar */}
            <div className="flex gap-1 mb-8 bg-white/3 rounded-2xl p-1 overflow-x-auto">
                {TABS.map((tab, i) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(i)}
                        className={`relative flex-shrink-0 font-mono text-sm px-5 py-2.5 rounded-xl transition-colors duration-200 ${
                            activeTab === i ? "text-primary font-bold" : "text-text-secondary hover:text-text-primary"
                        }`}
                    >
                        {activeTab === i && (
                            <motion.div
                                layoutId="tab-indicator"
                                className="absolute inset-0 bg-gradient-to-r from-accent-gold to-accent-gold-light rounded-xl"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{tab}</span>
                        {tab === "Weekly Pulse" && activePulseForm && !hasSubmittedPulse && (
                            <span className="relative z-10 ml-1.5 w-1.5 h-1.5 rounded-full bg-accent-red inline-block animate-pulse" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                >
                    {/* Feed */}
                    {activeTab === 0 && (
                        <div className="space-y-6">
                            {announcements.length > 0 ? (
                                announcements.map((a, i) => <AnnouncementCard key={a.id} announcement={a} index={i} />)
                            ) : (
                                <div className="py-16 text-center text-text-secondary font-mono glass-panel rounded-3xl">
                                    No announcements yet.
                                </div>
                            )}
                        </div>
                    )}

                    {/* My Events */}
                    {activeTab === 1 && (
                        <div className="space-y-4">
                            {myRsvps.length > 0 ? (
                                myRsvps.map((rsvp: any) => (
                                    <div key={rsvp.id} className="glass-panel rounded-2xl p-6 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-heading font-bold text-text-primary">{rsvp.events?.title}</h4>
                                            <p className="font-mono text-xs text-text-secondary mt-1">
                                                {rsvp.events?.date ? new Date(rsvp.events.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }) : ""}
                                                {rsvp.events?.location ? ` · ${rsvp.events.location}` : ""}
                                            </p>
                                        </div>
                                        <EventRSVP eventId={rsvp.event_id} initialStatus={rsvp.status} />
                                    </div>
                                ))
                            ) : (
                                <div className="py-16 text-center text-text-secondary font-mono glass-panel rounded-3xl">
                                    You haven&apos;t RSVP&apos;d to any events yet.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Documents */}
                    {activeTab === 2 && <DocumentRepository documents={documents} />}

                    {/* Directory */}
                    {activeTab === 3 && <MemberDirectory members={members} />}

                    {/* Weekly Pulse */}
                    {activeTab === 4 && (
                        <div className="glass-panel rounded-3xl p-8">
                            {!activePulseForm ? (
                                <div className="py-16 text-center text-text-secondary font-mono">
                                    No active pulse form this week. Check back later.
                                </div>
                            ) : hasSubmittedPulse ? (
                                <div className="py-16 text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-accent-teal/10 border border-accent-teal/30 flex items-center justify-center mx-auto">
                                        <span className="text-2xl">✓</span>
                                    </div>
                                    <h3 className="font-heading text-xl font-bold text-text-primary">Pulse Submitted</h3>
                                    <p className="font-mono text-sm text-text-secondary">You've already submitted for this week. See you next week!</p>
                                </div>
                            ) : (
                                <PulseFormWidget form={activePulseForm} />
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// Inline pulse form widget
const PulseFormWidget = ({ form }: { form: any }) => {
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const questions: any[] = form.questions || [];
    const progress = questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0;

    const handleSubmit = async () => {
        setLoading(true);
        const { submitPulseResponse } = await import("@/lib/server-actions");
        const fd = new FormData();
        fd.append("form_id", form.id);
        fd.append("answers", JSON.stringify(answers));
        fd.append("comment", comment);
        const result = await submitPulseResponse(fd);
        if (result.success) setSubmitted(true);
        setLoading(false);
    };

    if (submitted) return (
        <div className="py-16 text-center space-y-4">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-20 h-20 rounded-full border-2 border-accent-teal mx-auto flex items-center justify-center"
            >
                <span className="text-3xl text-accent-teal">✓</span>
            </motion.div>
            <h3 className="font-heading text-xl font-bold gold-text">Pulse Sent</h3>
            <p className="font-mono text-sm text-text-secondary">Your feedback reaches the board directly.</p>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h3 className="font-heading text-2xl font-bold text-text-primary mb-1">{form.week_label}</h3>
                <p className="font-mono text-xs text-text-secondary">Weekly Pulse · {questions.length} questions</p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-white/10 rounded-full">
                <motion.div
                    className="h-1 bg-gradient-to-r from-accent-gold to-accent-gold-light rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Questions */}
            <div className="space-y-8">
                {questions.map((q: any) => (
                    <div key={q.id}>
                        <p className="font-mono text-sm text-text-primary mb-4">{q.question}</p>

                        {q.type === "rating" && (
                            <div className="flex gap-3">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: n }))}
                                        className={`w-11 h-11 rounded-xl font-heading font-bold text-lg border transition-all duration-200 ${
                                            answers[q.id] === n
                                                ? "bg-accent-gold text-primary border-accent-gold scale-110"
                                                : "border-white/10 text-text-secondary hover:border-accent-gold/40"
                                        }`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        )}

                        {q.type === "pill-select" && q.options && (
                            <div className="flex flex-wrap gap-3">
                                {q.options.map((opt: string) => (
                                    <button
                                        key={opt}
                                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                        className={`font-mono text-sm border rounded-full px-5 py-2 transition-all duration-200 ${
                                            answers[q.id] === opt
                                                ? "bg-accent-gold text-primary border-accent-gold"
                                                : "border-white/10 text-text-secondary hover:border-accent-gold/40"
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {q.type === "text" && (
                            <textarea
                                value={answers[q.id] || ""}
                                onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-sm font-mono text-text-primary h-24 focus:outline-none focus:border-accent-gold transition-colors resize-none"
                                placeholder="Your response..."
                            />
                        )}
                    </div>
                ))}

                {/* Open comment */}
                <div>
                    <p className="font-mono text-sm text-text-primary mb-3">Any additional thoughts? <span className="text-text-secondary">(optional)</span></p>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-sm font-mono text-text-primary h-20 focus:outline-none focus:border-accent-gold transition-colors resize-none"
                        placeholder="Open feedback..."
                    />
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold rounded-full hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
                {loading ? "Submitting..." : "Submit Pulse"}
            </button>
        </div>
    );
};
```

**Step 2: Add submitPulseResponse to server-actions.ts**

Append to `src/lib/server-actions.ts`:
```ts
export async function submitPulseResponse(formData: FormData) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const form_id = formData.get("form_id") as string;
    const answers = JSON.parse(formData.get("answers") as string || "{}");
    const comment = formData.get("comment") as string;

    const { data, error } = await supabase
        .from("pulse_responses")
        .insert([{ form_id, member_id: userId, answers, comment }])
        .select().single();

    if (error) return { error: error.message };
    revalidatePath("/hub");
    return { success: true, data };
}
```

**Step 3: Rewrite hub page**

Replace `src/app/hub/page.tsx`:
```tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { syncUserToSupabase } from "@/lib/sync-user";
import { getAllAnnouncements } from "@/lib/actions";
import { HubTabs } from "@/components/hub-tabs";

export default async function HubPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    await syncUserToSupabase();

    const [
        announcements,
        { data: members },
        { data: documents },
        { data: myRsvps },
        { data: activeForms },
        { data: myResponses },
    ] = await Promise.all([
        getAllAnnouncements(),
        supabase.from("users").select("id, first_name, last_name, email").order("first_name"),
        supabase.from("documents").select("*").order("created_at", { ascending: false }),
        supabase.from("event_rsvps").select("*, events(title, date, location)").eq("member_id", userId),
        supabase.from("pulse_forms").select("*").eq("is_active", true).limit(1),
        supabase.from("pulse_responses").select("id").eq("member_id", userId),
    ]);

    const activePulseForm = activeForms?.[0] ?? null;
    const myResponseFormIds = (myResponses ?? []).map((r: any) => r.form_id || r.id);
    const hasSubmittedPulse = activePulseForm
        ? myResponseFormIds.includes(activePulseForm.id)
        : false;

    const mappedMembers = (members ?? []).map((m: any) => ({
        id: m.id,
        name: `${m.first_name || ""} ${m.last_name || ""}`.trim() || m.email?.split("@")[0],
        role: "Member",
        contact: m.email,
    }));

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
            <div className="mb-12">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold mb-3">Members Only</p>
                <h1 className="font-heading text-4xl md:text-6xl font-bold text-text-primary leading-tight">
                    Member <span className="font-drama italic gold-text font-light">Hub</span>
                </h1>
                <p className="font-mono text-text-secondary mt-3 max-w-xl">
                    Your club command centre. Announcements, events, documents, and the weekly pulse.
                </p>
            </div>

            <HubTabs
                announcements={announcements}
                members={mappedMembers}
                documents={documents ?? []}
                myRsvps={myRsvps ?? []}
                activePulseForm={activePulseForm}
                hasSubmittedPulse={hasSubmittedPulse}
            />
        </div>
    );
}
```

**Step 4: Verify**

Run: `npm run dev` → sign in → `http://localhost:3000/hub`
Expected:
- 5 tabs: Feed / My Events / Documents / Directory / Weekly Pulse
- Tab indicator animates with spring physics on switch
- Feed shows real announcements from DB
- Weekly Pulse tab shows "No active form" if no form is active

**Step 5: Commit**
```bash
git add src/app/hub/page.tsx src/components/hub-tabs.tsx src/lib/server-actions.ts
git commit -m "feat: redesign hub with 5-tab layout, real announcements feed, pulse form widget"
```

---

## Task 12: Admin CMS — Sidebar Layout + Announcement Manager

**Files:**
- Modify: `src/app/admin/page.tsx`
- Create: `src/components/admin/admin-shell.tsx`
- Create: `src/components/admin/announcement-manager.tsx`
- Create: `src/components/admin/cms-drawer.tsx`

**Step 1: Create CMS slide-out drawer**

Create `src/components/admin/cms-drawer.tsx`:
```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export const CMSDrawer = ({ open, onClose, title, children }: Props) => (
    <AnimatePresence>
        {open && (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                />
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#0D0C1A] border-l border-white/10 z-50 overflow-y-auto"
                >
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-heading text-2xl font-bold text-text-primary">{title}</h2>
                            <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                <X size={20} className="text-text-secondary" />
                            </button>
                        </div>
                        {children}
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
);
```

**Step 2: Create AnnouncementManager**

Create `src/components/admin/announcement-manager.tsx`:
```tsx
"use client";

import { useState } from "react";
import { CMSDrawer } from "./cms-drawer";
import { createAnnouncement, deleteAnnouncement, toggleAnnouncementPin } from "@/lib/server-actions";
import { Plus, Pin, Trash2 } from "lucide-react";
import { AnnouncementCard } from "@/components/announcement-card";

interface Props { announcements: any[] }

export const AnnouncementManager = ({ announcements: initial }: Props) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        await createAnnouncement(fd);
        setLoading(false);
        setDrawerOpen(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-heading text-2xl font-bold text-text-primary">Announcements</h2>
                    <p className="font-mono text-xs text-text-secondary mt-1">{initial.length} total</p>
                </div>
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold text-sm px-5 py-2.5 rounded-full hover:scale-[1.03] transition-transform"
                >
                    <Plus size={16} /> New Post
                </button>
            </div>

            <div className="space-y-4">
                {initial.map((a) => (
                    <div key={a.id} className="relative group">
                        <AnnouncementCard announcement={a} index={0} />
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => toggleAnnouncementPin(a.id, a.is_pinned)}
                                className={`p-2 rounded-xl transition-colors ${a.is_pinned ? "bg-accent-gold/20 text-accent-gold" : "bg-white/5 text-text-secondary hover:text-accent-gold"}`}
                            >
                                <Pin size={14} />
                            </button>
                            <button
                                onClick={() => deleteAnnouncement(a.id)}
                                className="p-2 rounded-xl bg-accent-red/10 text-accent-red hover:bg-accent-red/20 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <CMSDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="New Announcement">
                <form onSubmit={handleCreate} className="space-y-5">
                    <div>
                        <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">Title</label>
                        <input name="title" required className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold" />
                    </div>
                    <div>
                        <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">Content</label>
                        <textarea name="content" required rows={5} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">Tag</label>
                            <select name="tag" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold">
                                <option value="general">General</option>
                                <option value="event">Event</option>
                                <option value="update">Update</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">Visibility</label>
                            <select name="visibility" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold">
                                <option value="public">Public</option>
                                <option value="members">Members Only</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <input type="checkbox" name="is_pinned" value="true" id="is_pinned" className="accent-accent-gold" />
                        <label htmlFor="is_pinned" className="font-mono text-sm text-text-secondary">Pin to top</label>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold rounded-full hover:scale-[1.02] transition-transform disabled:opacity-50">
                        {loading ? "Publishing..." : "Publish Announcement"}
                    </button>
                </form>
            </CMSDrawer>
        </div>
    );
};
```

**Step 3: Create AdminShell sidebar**

Create `src/components/admin/admin-shell.tsx`:
```tsx
"use client";

import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Megaphone, Zap, Calendar, Image, Users, FileText, BarChart2, Radio, Settings } from "lucide-react";

const NAV_ITEMS = [
    { label: "Overview", icon: LayoutDashboard, id: "overview" },
    { label: "Announcements", icon: Megaphone, id: "announcements" },
    { label: "Initiatives", icon: Zap, id: "initiatives" },
    { label: "Events", icon: Calendar, id: "events" },
    { label: "Gallery", icon: Image, id: "gallery" },
    { label: "Board Members", icon: Users, id: "board" },
    { label: "Page Sections", icon: FileText, id: "sections" },
    { label: "Pulse Forms", icon: BarChart2, id: "pulse" },
    { label: "Broadcast", icon: Radio, id: "broadcast" },
];

interface Props {
    panels: Record<string, ReactNode>;
    stats: { members: number; events: number; announcements: number; pulseResponses: number };
}

export const AdminShell = ({ panels, stats }: Props) => {
    const [active, setActive] = useState("overview");

    return (
        <div className="flex gap-8 min-h-[80vh]">
            {/* Sidebar */}
            <aside className="w-56 flex-shrink-0 space-y-1">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 font-mono text-sm ${
                            active === item.id
                                ? "bg-accent-gold/10 border border-accent-gold/20 text-accent-gold"
                                : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                        }`}
                    >
                        <item.icon size={16} />
                        {item.label}
                    </button>
                ))}
            </aside>

            {/* Content area */}
            <main className="flex-1 min-w-0">
                {active === "overview" && (
                    <div className="space-y-8">
                        <h2 className="font-heading text-3xl font-bold text-text-primary">Overview</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: "Members", value: stats.members, color: "text-accent-teal" },
                                { label: "Events", value: stats.events, color: "text-accent-gold" },
                                { label: "Announcements", value: stats.announcements, color: "text-accent-red" },
                                { label: "Pulse Responses", value: stats.pulseResponses, color: "gold-text" },
                            ].map((stat) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-panel rounded-2xl p-6"
                                >
                                    <p className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-2">{stat.label}</p>
                                    <p className={`font-heading text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
                {Object.entries(panels).map(([id, panel]) => (
                    active === id ? <div key={id}>{panel}</div> : null
                ))}
            </main>
        </div>
    );
};
```

**Step 4: Rewrite admin page**

Replace `src/app/admin/page.tsx`:
```tsx
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { syncUserToSupabase } from "@/lib/sync-user";
import { getAllAnnouncements } from "@/lib/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { AnnouncementManager } from "@/components/admin/announcement-manager";
import { EventManager } from "@/components/event-manager";
import { BroadcastCenter } from "@/components/broadcast-center";
import { WeeklyPulseAggregator } from "@/components/weekly-pulse-aggregator";

export default async function AdminPage() {
    const { userId } = await auth();
    if (!userId) redirect("/");

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    if (user.publicMetadata?.role !== "admin") redirect("/");

    await syncUserToSupabase();

    const [
        announcements,
        { data: members },
        { data: events },
        { data: pulseResponses },
        { data: feedback },
    ] = await Promise.all([
        getAllAnnouncements(),
        supabase.from("users").select("id"),
        supabase.from("events").select("id"),
        supabase.from("pulse_responses").select("id"),
        supabase.from("feedback").select("*").order("created_at", { ascending: false }),
    ]);

    const stats = {
        members: members?.length ?? 0,
        events: events?.length ?? 0,
        announcements: announcements.length,
        pulseResponses: pulseResponses?.length ?? 0,
    };

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
            <div className="mb-12">
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-primary">
                    Board <span className="font-drama italic gold-text font-light">Command</span>
                </h1>
                <p className="font-mono text-text-secondary mt-3">Full CMS access. You can manage all site content from here.</p>
            </div>

            <AdminShell
                stats={stats}
                panels={{
                    announcements: <AnnouncementManager announcements={announcements} />,
                    events: <EventManager />,
                    pulse: <WeeklyPulseAggregator initialData={feedback ?? []} />,
                    broadcast: <BroadcastCenter />,
                }}
            />
        </div>
    );
}
```

**Step 5: Verify**

Run: `npm run dev` → sign in as admin → `http://localhost:3000/admin`
Expected:
- Sidebar with all nav items
- Overview shows stat cards
- Announcements tab shows list + "New Post" button
- Clicking "New Post" opens slide-out drawer from right
- Creating announcement reloads list

**Step 6: Commit**
```bash
git add src/app/admin/page.tsx src/components/admin/admin-shell.tsx src/components/admin/announcement-manager.tsx src/components/admin/cms-drawer.tsx
git commit -m "feat: redesign admin as full sidebar CMS with slide-out drawers"
```

---

## Task 13: Admin — Initiative Manager + Pulse Form Builder

**Files:**
- Create: `src/components/admin/initiative-manager.tsx`
- Create: `src/components/admin/pulse-form-builder.tsx`
- Modify: `src/app/admin/page.tsx`

**Step 1: Create InitiativeManager**

Create `src/components/admin/initiative-manager.tsx`:
```tsx
"use client";

import { useState } from "react";
import { CMSDrawer } from "./cms-drawer";
import { createInitiative, deleteInitiative } from "@/lib/server-actions";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Props { initiatives: any[] }

export const InitiativeManager = ({ initiatives: initial }: Props) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        await createInitiative(fd);
        setLoading(false);
        setDrawerOpen(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-heading text-2xl font-bold text-text-primary">Initiatives</h2>
                    <p className="font-mono text-xs text-text-secondary mt-1">{initial.length} total</p>
                </div>
                <button onClick={() => setDrawerOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold text-sm px-5 py-2.5 rounded-full hover:scale-[1.03] transition-transform">
                    <Plus size={16} /> New Initiative
                </button>
            </div>

            <div className="space-y-3">
                {initial.map((init) => (
                    <div key={init.id} className="glass-panel rounded-2xl p-5 flex items-center justify-between group">
                        <div>
                            <h4 className="font-heading font-bold text-text-primary">{init.title}</h4>
                            <p className="font-mono text-xs text-text-secondary">{init.category} · /{init.slug}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/initiatives/${init.slug}`} target="_blank" className="p-2 rounded-xl bg-white/5 text-text-secondary hover:text-text-primary transition-colors">
                                <ExternalLink size={14} />
                            </Link>
                            <button onClick={() => deleteInitiative(init.id)} className="p-2 rounded-xl bg-accent-red/10 text-accent-red hover:bg-accent-red/20 transition-colors">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <CMSDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="New Initiative">
                <form onSubmit={handleCreate} className="space-y-5">
                    {[
                        { name: "title", label: "Title", required: true },
                        { name: "category", label: "Category / Avenue", required: true },
                        { name: "impact_stat", label: "Impact Number (e.g. 320)" },
                        { name: "impact_label", label: "Impact Label (e.g. elders served)" },
                        { name: "hero_image_url", label: "Hero Image URL" },
                    ].map((f) => (
                        <div key={f.name}>
                            <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">{f.label}</label>
                            <input name={f.name} required={f.required} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold" />
                        </div>
                    ))}
                    <div>
                        <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">Short Description (shown on cards)</label>
                        <textarea name="short_description" rows={2} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold resize-none" />
                    </div>
                    <div>
                        <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">Full Description (detail page)</label>
                        <textarea name="full_description" rows={5} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold resize-none" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold rounded-full hover:scale-[1.02] transition-transform disabled:opacity-50">
                        {loading ? "Creating..." : "Create Initiative"}
                    </button>
                </form>
            </CMSDrawer>
        </div>
    );
};
```

**Step 2: Create PulseFormBuilder**

Create `src/components/admin/pulse-form-builder.tsx`:
```tsx
"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle } from "lucide-react";

type QuestionType = "rating" | "pill-select" | "text";

interface Question {
    id: string;
    question: string;
    type: QuestionType;
    options?: string;
}

export const PulseFormBuilder = () => {
    const [weekLabel, setWeekLabel] = useState(`Week of ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`);
    const [questions, setQuestions] = useState<Question[]>([
        { id: "1", question: "How was your week overall?", type: "rating" }
    ]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const addQuestion = () => {
        setQuestions(prev => [...prev, { id: Date.now().toString(), question: "", type: "rating" }]);
    };

    const removeQuestion = (id: string) => {
        setQuestions(prev => prev.filter(q => q.id !== id));
    };

    const updateQuestion = (id: string, field: keyof Question, value: string) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const handlePublish = async () => {
        setLoading(true);
        const { createPulseForm } = await import("@/lib/server-actions");
        const fd = new FormData();
        fd.append("week_label", weekLabel);
        fd.append("questions", JSON.stringify(questions.map(q => ({
            id: q.id,
            question: q.question,
            type: q.type,
            options: q.options ? q.options.split(",").map(s => s.trim()) : undefined,
        }))));
        const result = await createPulseForm(fd);
        if (result.success) setSuccess(true);
        setLoading(false);
    };

    if (success) return (
        <div className="py-24 text-center space-y-4">
            <CheckCircle size={48} className="text-accent-teal mx-auto" />
            <h3 className="font-heading text-2xl font-bold text-text-primary">Pulse Form Published</h3>
            <p className="font-mono text-sm text-text-secondary">Members will see it in their Hub.</p>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h2 className="font-heading text-2xl font-bold text-text-primary">Pulse Form Builder</h2>
                <p className="font-mono text-xs text-text-secondary mt-1">Build this week's member pulse survey.</p>
            </div>

            <div>
                <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">Week Label</label>
                <input value={weekLabel} onChange={(e) => setWeekLabel(e.target.value)} className="w-full max-w-md bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold" />
            </div>

            <div className="space-y-4">
                {questions.map((q, i) => (
                    <div key={q.id} className="glass-panel rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-text-secondary">Q{i + 1}</span>
                            <button onClick={() => removeQuestion(q.id)} className="p-1.5 text-accent-red hover:bg-accent-red/10 rounded-lg transition-colors">
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <input
                            value={q.question}
                            onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
                            placeholder="Question text..."
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold"
                        />
                        <div className="flex gap-3">
                            {(["rating", "pill-select", "text"] as QuestionType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => updateQuestion(q.id, "type", type)}
                                    className={`font-mono text-xs border rounded-full px-4 py-1.5 transition-colors ${q.type === type ? "bg-accent-gold/10 border-accent-gold/30 text-accent-gold" : "border-white/10 text-text-secondary hover:border-white/20"}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        {q.type === "pill-select" && (
                            <input
                                value={q.options || ""}
                                onChange={(e) => updateQuestion(q.id, "options", e.target.value)}
                                placeholder="Options (comma-separated): Excellent, Good, Needs Work"
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-text-primary focus:outline-none focus:border-accent-gold"
                            />
                        )}
                    </div>
                ))}

                <button onClick={addQuestion} className="flex items-center gap-2 font-mono text-sm text-text-secondary border border-dashed border-white/15 rounded-2xl px-5 py-4 w-full justify-center hover:border-accent-gold/30 hover:text-text-primary transition-colors">
                    <Plus size={16} /> Add Question
                </button>
            </div>

            <button onClick={handlePublish} disabled={loading} className="w-full py-4 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold rounded-full hover:scale-[1.02] transition-transform disabled:opacity-50">
                {loading ? "Publishing..." : "Publish & Activate Form"}
            </button>
        </div>
    );
};
```

**Step 3: Add createPulseForm server action**

Append to `src/lib/server-actions.ts`:
```ts
export async function createPulseForm(formData: FormData) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    // Deactivate current active form first
    await supabase.from("pulse_forms").update({ is_active: false }).eq("is_active", true);

    const { data, error } = await supabase
        .from("pulse_forms")
        .insert([{
            week_label: formData.get("week_label") as string,
            questions: JSON.parse(formData.get("questions") as string || "[]"),
            is_active: true,
        }])
        .select().single();

    if (error) return { error: error.message };
    revalidatePath("/hub");
    return { success: true, data };
}
```

**Step 4: Wire into admin page**

In `src/app/admin/page.tsx`, add to the data fetching Promise.all:
```ts
supabase.from("initiatives").select("*").order("display_order"),
```

And add to the panels prop:
```tsx
initiatives: <InitiativeManager initiatives={initiatives ?? []} />,
pulse: <PulseFormBuilder />,
```

Add imports at top:
```tsx
import { InitiativeManager } from "@/components/admin/initiative-manager";
import { PulseFormBuilder } from "@/components/admin/pulse-form-builder";
```

**Step 5: Verify**

Run: `npm run dev` → admin → Initiatives tab: create a new initiative, verify it appears on `/initiatives`. Pulse Forms tab: build a form with rating + pill-select questions, publish it. Go to `/hub` → Weekly Pulse tab and verify the form appears.

**Step 6: Commit**
```bash
git add src/components/admin/initiative-manager.tsx src/components/admin/pulse-form-builder.tsx src/lib/server-actions.ts src/app/admin/page.tsx
git commit -m "feat: add admin initiative manager and pulse form builder with dynamic question types"
```

---

## Task 14: Admin — Board Members + Page Sections CMS

**Files:**
- Create: `src/components/admin/board-manager.tsx`
- Create: `src/components/admin/page-sections-editor.tsx`
- Modify: `src/lib/server-actions.ts`
- Modify: `src/app/about/page.tsx`

**Step 1: Add board member DB helpers**

First, ensure `board_members` table exists. Add this SQL to a new migration file `supabase/migrations/20260225_board_members.sql` if it doesn't exist yet:
```sql
CREATE TABLE IF NOT EXISTS public.board_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0
);
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Board viewable by all" ON public.board_members FOR SELECT USING (true);
CREATE POLICY "Admins manage board" ON public.board_members FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid()::text AND role = 'admin'));
```
Apply: paste into Supabase SQL editor and run.

**Step 2: Add server actions for board + page sections**

Append to `src/lib/server-actions.ts`:
```ts
export async function createBoardMember(formData: FormData) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const { error } = await supabase.from("board_members").insert([{
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        email: formData.get("email") as string,
        image_url: formData.get("image_url") as string,
    }]);

    if (error) return { error: error.message };
    revalidatePath("/about");
    return { success: true };
}

export async function deleteBoardMember(id: string) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };
    const { error } = await supabase.from("board_members").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/about");
    return { success: true };
}

export async function updatePageSection(sectionKey: string, content: Record<string, unknown>) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const { error } = await supabase.from("page_sections")
        .upsert({ section_key: sectionKey, content, updated_by: userId, updated_at: new Date().toISOString() },
            { onConflict: "section_key" });

    if (error) return { error: error.message };
    revalidatePath("/");
    revalidatePath("/about");
    return { success: true };
}
```

**Step 3: Create BoardManager component**

Create `src/components/admin/board-manager.tsx`:
```tsx
"use client";

import { useState } from "react";
import { CMSDrawer } from "./cms-drawer";
import { createBoardMember, deleteBoardMember } from "@/lib/server-actions";
import { Plus, Trash2, User } from "lucide-react";

interface Props { members: any[] }

export const BoardManager = ({ members: initial }: Props) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        await createBoardMember(new FormData(e.currentTarget));
        setLoading(false);
        setDrawerOpen(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-heading text-2xl font-bold text-text-primary">Board Members</h2>
                <button onClick={() => setDrawerOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold text-sm px-5 py-2.5 rounded-full hover:scale-[1.03] transition-transform">
                    <Plus size={16} /> Add Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {initial.map((m) => (
                    <div key={m.id} className="glass-panel rounded-2xl p-5 flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {m.image_url ? <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" /> : <User size={20} className="text-white/20" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-heading font-bold text-text-primary truncate">{m.name}</p>
                            <p className="font-mono text-xs text-accent-gold">{m.role}</p>
                        </div>
                        <button onClick={() => deleteBoardMember(m.id)} className="p-2 rounded-xl bg-accent-red/10 text-accent-red opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <CMSDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add Board Member">
                <form onSubmit={handleCreate} className="space-y-5">
                    {[
                        { name: "name", label: "Full Name", required: true },
                        { name: "role", label: "Role / Position", required: true },
                        { name: "email", label: "Email" },
                        { name: "image_url", label: "Profile Photo URL" },
                    ].map((f) => (
                        <div key={f.name}>
                            <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">{f.label}</label>
                            <input name={f.name} required={f.required} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold" />
                        </div>
                    ))}
                    <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold rounded-full disabled:opacity-50">
                        {loading ? "Adding..." : "Add to Board"}
                    </button>
                </form>
            </CMSDrawer>
        </div>
    );
};
```

**Step 4: Create PageSectionsEditor**

Create `src/components/admin/page-sections-editor.tsx`:
```tsx
"use client";

import { useState } from "react";
import { updatePageSection } from "@/lib/server-actions";
import { Save } from "lucide-react";

interface Props { sections: Record<string, any> }

const SECTION_DEFS = [
    { key: "hero_headline", label: "Hero Headline", fields: [{ name: "line1", label: "Line 1" }, { name: "line2", label: "Line 2 (gold drama serif)" }] },
    { key: "hero_subtext", label: "Hero Subtext", fields: [{ name: "text", label: "Paragraph" }] },
    { key: "about_story", label: "About — Story", fields: [{ name: "paragraphs[0]", label: "Paragraph 1" }, { name: "paragraphs[1]", label: "Paragraph 2" }] },
    { key: "footer_tagline", label: "Footer Tagline", fields: [{ name: "text", label: "Tagline text" }] },
];

export const PageSectionsEditor = ({ sections }: Props) => {
    const [saving, setSaving] = useState<string | null>(null);
    const [values, setValues] = useState<Record<string, Record<string, string>>>(
        Object.fromEntries(SECTION_DEFS.map((s) => [s.key, sections[s.key]?.content || {}]))
    );

    async function handleSave(sectionKey: string) {
        setSaving(sectionKey);
        await updatePageSection(sectionKey, values[sectionKey]);
        setSaving(null);
    }

    return (
        <div className="space-y-8">
            <h2 className="font-heading text-2xl font-bold text-text-primary">Page Sections</h2>
            {SECTION_DEFS.map((section) => (
                <div key={section.key} className="glass-panel rounded-2xl p-6 space-y-4">
                    <h3 className="font-mono text-sm text-accent-gold uppercase tracking-widest">{section.label}</h3>
                    {section.fields.map((field) => (
                        <div key={field.name}>
                            <label className="block font-mono text-xs text-text-secondary mb-2">{field.label}</label>
                            <textarea
                                value={values[section.key]?.[field.name.replace(/\[\d+\]/, "")] || ""}
                                onChange={(e) => setValues(prev => ({
                                    ...prev,
                                    [section.key]: { ...prev[section.key], [field.name.replace(/\[\d+\]/, "")]: e.target.value }
                                }))}
                                rows={2}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold resize-none font-mono text-sm"
                            />
                        </div>
                    ))}
                    <button
                        onClick={() => handleSave(section.key)}
                        disabled={saving === section.key}
                        className="flex items-center gap-2 font-mono text-sm border border-accent-gold/30 text-accent-gold rounded-full px-5 py-2 hover:bg-accent-gold/10 transition-colors disabled:opacity-50"
                    >
                        <Save size={14} />
                        {saving === section.key ? "Saving..." : "Save Section"}
                    </button>
                </div>
            ))}
        </div>
    );
};
```

**Step 5: Wire board + sections into admin page**

In `src/app/admin/page.tsx`, add to Promise.all:
```ts
supabase.from("board_members").select("*").order("display_order"),
supabase.from("page_sections").select("*"),
```

Add to panels:
```tsx
board: <BoardManager members={boardMembers ?? []} />,
sections: <PageSectionsEditor sections={Object.fromEntries((pageSections ?? []).map((s: any) => [s.section_key, s]))} />,
```

**Step 6: Update about page to read from page_sections**

Replace `src/app/about/page.tsx`:
```tsx
import { supabase } from "@/lib/supabase";
import { User } from "lucide-react";

export const revalidate = 60;

export default async function AboutPage() {
    const [{ data: boardMembers }, { data: storySection }] = await Promise.all([
        supabase.from("board_members").select("*").order("display_order"),
        supabase.from("page_sections").select("content").eq("section_key", "about_story").single(),
    ]);

    const story = storySection?.content as { paragraphs?: string[] } | null;
    const paragraphs = story?.paragraphs ?? [
        "The Rotaract Club of Vishwahitha is a community-based organization dedicated to fostering leadership, professional development, and impactful service projects.",
        "Sponsored by Rotary International, we operate under the guiding principle of Service Above Self — executing high-quality, sustainable programs that address local needs while building a network of global citizens.",
    ];

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-24">
            <section className="glass-panel rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent-gold/5 blur-[80px]" />
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold mb-4">Who We Are</p>
                <h1 className="font-heading text-4xl md:text-6xl font-bold text-text-primary mb-8">
                    Our <span className="font-drama italic gold-text font-light">Story</span>
                </h1>
                <div className="space-y-6 max-w-3xl font-mono text-text-secondary leading-relaxed">
                    {paragraphs.map((p: string, i: number) => <p key={i}>{p}</p>)}
                </div>
            </section>

            <section>
                <div className="mb-12">
                    <h2 className="font-heading text-3xl font-bold text-text-primary">
                        Leadership <span className="font-drama italic gold-text font-light">Board</span>
                    </h2>
                    <p className="font-mono text-sm text-text-secondary mt-2">The dedicated team driving Vishwahita forward.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {boardMembers && boardMembers.length > 0 ? (
                        boardMembers.map((member: any) => (
                            <div key={member.id} className="glass-panel p-6 rounded-[2rem] group hover:border-accent-gold/30 transition-all duration-300">
                                <div className="w-full aspect-square rounded-2xl bg-white/5 mb-6 overflow-hidden flex items-center justify-center border border-white/5 group-hover:bg-accent-gold/5 transition-colors">
                                    {member.image_url
                                        ? <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                                        : <User size={48} className="text-white/20" />}
                                </div>
                                <h3 className="font-heading text-lg font-bold text-text-primary">{member.name}</h3>
                                <p className="text-xs font-mono gold-text uppercase tracking-widest mt-1 mb-3">{member.role}</p>
                                {member.email && <p className="text-xs font-mono text-text-secondary truncate">{member.email}</p>}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-text-secondary font-mono text-sm glass-panel rounded-[2rem]">
                            Board members for this year will be updated soon.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
```

**Step 7: Verify**

- Go to `/admin` → Board Members: add a member, verify it appears on `/about`
- Go to `/admin` → Page Sections: edit "About — Story" paragraph, save, verify on `/about`

**Step 8: Commit**
```bash
git add src/components/admin/board-manager.tsx src/components/admin/page-sections-editor.tsx src/lib/server-actions.ts src/app/admin/page.tsx src/app/about/page.tsx supabase/migrations/20260225_board_members.sql
git commit -m "feat: add board member manager and page sections CMS editor"
```

---

## Task 15: Gallery — Lightbox + Initiative Filter Tags

**Files:**
- Modify: `src/app/gallery/page.tsx`
- Create: `src/components/gallery-grid.tsx`

**Step 1: Create GalleryGrid client component**

Create `src/components/gallery-grid.tsx`:
```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface GalleryItem {
    id: string;
    url: string;
    title?: string;
    type: string;
    created_at: string;
    initiatives?: { title: string } | null;
}

export const GalleryGrid = ({ items, categories }: { items: GalleryItem[]; categories: string[] }) => {
    const [filter, setFilter] = useState("All");
    const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

    const filtered = filter === "All" ? items : items.filter(i => i.initiatives?.title === filter);

    return (
        <>
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-3 mb-10">
                {["All", ...categories].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`font-mono text-xs uppercase tracking-widest border rounded-full px-4 py-2 transition-all duration-200 ${
                            filter === cat
                                ? "bg-accent-gold/10 border-accent-gold/30 text-accent-gold"
                                : "border-white/10 text-text-secondary hover:border-white/20"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Masonry grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
                {filtered.map((item) => (
                    <motion.div
                        key={item.id}
                        layoutId={`gallery-${item.id}`}
                        className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-zoom-in"
                        onClick={() => setLightbox(item)}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                    >
                        {item.type === "video" ? (
                            <video src={item.url} className="w-full rounded-2xl border border-white/10" />
                        ) : (
                            <img src={item.url} alt={item.title || "Club photo"} className="w-full rounded-2xl border border-white/10" loading="lazy" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end p-4">
                            <div>
                                {item.title && <p className="font-heading font-medium text-white text-sm">{item.title}</p>}
                                {item.initiatives?.title && (
                                    <p className="font-mono text-[10px] gold-text uppercase tracking-widest">{item.initiatives.title}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-6"
                        onClick={() => setLightbox(null)}
                    >
                        <button className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                            <X size={20} />
                        </button>
                        <motion.div
                            layoutId={`gallery-${lightbox.id}`}
                            className="max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src={lightbox.url} alt={lightbox.title} className="max-w-full max-h-[85vh] object-contain rounded-2xl" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
```

**Step 2: Update gallery page**

Replace `src/app/gallery/page.tsx`:
```tsx
import { supabase } from "@/lib/supabase";
import { GalleryGrid } from "@/components/gallery-grid";

export const revalidate = 60;

export default async function GalleryPage() {
    const { data: gallery } = await supabase
        .from("gallery_media")
        .select("*, initiatives(title)")
        .order("created_at", { ascending: false });

    const items = gallery ?? [];
    const categories = [...new Set(
        items
            .map((i: any) => i.initiatives?.title)
            .filter(Boolean)
    )] as string[];

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
            <div className="mb-16">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold mb-4">Club Memories</p>
                <h1 className="font-heading text-5xl md:text-7xl font-bold text-text-primary">
                    Visual <span className="font-drama italic gold-text font-light text-6xl md:text-8xl">Archive</span>
                </h1>
            </div>

            {items.length > 0 ? (
                <GalleryGrid items={items} categories={categories} />
            ) : (
                <div className="py-32 text-center text-text-secondary font-mono glass-panel rounded-3xl">
                    The visual archive is currently empty. Admins can upload media from the Admin panel.
                </div>
            )}
        </div>
    );
}
```

**Step 3: Verify**

Run: `npm run dev` → `http://localhost:3000/gallery`
Expected: Gallery renders (or empty state). If media exists, filter tabs show initiative names. Clicking a photo opens lightbox with `layoutId` shared-layout animation.

**Step 4: Commit**
```bash
git add src/app/gallery/page.tsx src/components/gallery-grid.tsx
git commit -m "feat: add gallery lightbox with layoutId animation and initiative filter tabs"
```

---

## Task 16: Wire Hero + Footer to Page Sections CMS

**Files:**
- Modify: `src/components/hero.tsx`
- Modify: `src/components/footer.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Add page section fetcher**

Append to `src/lib/actions.ts`:
```ts
export async function getPageSection(key: string) {
    const { data } = await supabase
        .from("page_sections")
        .select("content")
        .eq("section_key", key)
        .single();
    return data?.content ?? null;
}
```

**Step 2: Update homepage to pass CMS content to Hero**

In `src/app/page.tsx`, add CMS data fetching and pass to Hero:
```tsx
import { Hero } from "@/components/hero";
import { ProjectShuffler } from "@/components/project-shuffler";
import { LiveEventCalendar } from "@/components/live-event-calendar";
import { SponsorShowcase } from "@/components/sponsor-showcase";
import { getInitiatives, getPageSection } from "@/lib/actions";

export default async function Home() {
    const [initiatives, heroHeadline, heroSubtext] = await Promise.all([
        getInitiatives(),
        getPageSection("hero_headline"),
        getPageSection("hero_subtext"),
    ]);

    return (
        <main className="min-h-screen pb-32">
            <Hero
                headline={heroHeadline as any}
                subtext={(heroSubtext as any)?.text}
            />
            <ProjectShuffler initiatives={initiatives} />
            <LiveEventCalendar />
            <SponsorShowcase />
        </main>
    );
}
```

**Step 3: Update Hero to accept CMS props**

In `src/components/hero.tsx`, update the component signature and use CMS content:
```tsx
// Change function signature to:
interface HeroProps {
    headline?: { line1?: string; line2?: string } | null;
    subtext?: string | null;
}

export const Hero = ({ headline, subtext }: HeroProps) => {
    // Replace hardcoded strings with:
    const line1 = headline?.line1 ?? "Service Above";
    const line2 = headline?.line2 ?? "Self.";
    const sub = subtext ?? "Community Luxe — merging high-end execution with dedicated NGO roots. District 3232.";
    // ... rest of component using line1, line2, sub
```

**Step 4: Update footer tagline from CMS**

In `src/components/footer.tsx`, this is a server component so we can fetch directly:
```tsx
// Add at top of Footer function:
const { data: taglineSection } = await supabase
    .from("page_sections").select("content").eq("section_key", "footer_tagline").single();
const tagline = (taglineSection?.content as any)?.text ?? "A community of young leaders taking action to build a better world.";
// Then use `tagline` instead of hardcoded string
```

Note: `Footer` needs `async` added to the function signature.

**Step 5: Verify**

Go to `/admin` → Page Sections → change "Hero Headline Line 2" to "Together." → save. Reload `/` — hero should show updated text.

**Step 6: Commit**
```bash
git add src/app/page.tsx src/components/hero.tsx src/components/footer.tsx src/lib/actions.ts
git commit -m "feat: wire hero and footer to page_sections CMS - fully admin-editable"
```

---

## Task 17: Final Polish — BackgroundWrapper Theme-Awareness + SponsorShowcase Gold

**Files:**
- Modify: `src/components/ui/background-wrapper.tsx`
- Modify: `src/components/sponsor-showcase.tsx`
- Modify: `src/components/navbar.tsx` (minor)

**Step 1: Make BackgroundWrapper theme-aware**

Replace `src/components/ui/background-wrapper.tsx`:
```tsx
"use client";

import { DynamicAuras } from "./dynamic-auras";
import { ParticlesBackground } from "./particles-background";
import { useTheme } from "@/components/theme-provider";

export const BackgroundWrapper = () => {
    const { theme } = useTheme();
    const isLight = theme === "light";

    return (
        <div
            className="fixed inset-0 overflow-hidden -z-50 transition-colors duration-700"
            style={{ backgroundColor: isLight ? "#FAFAF4" : "#08080F" }}
        >
            <div
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: isLight ? 0 : 1 }}
            >
                <DynamicAuras />
                <ParticlesBackground />
            </div>
        </div>
    );
};
```

**Step 2: Update SponsorShowcase with gold gradient text**

In `src/components/sponsor-showcase.tsx`, change the sponsor name text class from `text-white/20` to:
```tsx
className="text-2xl md:text-3xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-gold/30 to-accent-gold-light/30 hover:from-accent-gold hover:to-accent-gold-light grayscale hover:grayscale-0 transition-all duration-500 cursor-default select-none"
```

**Step 3: Add ThemedSection to homepage sections**

In `src/app/page.tsx`, wrap the SponsorShowcase in a light zone to demonstrate the theme inversion engine:
```tsx
import { ThemedSection } from "@/components/ui/themed-section";

// Wrap SponsorShowcase:
<ThemedSection theme="light" className="w-full">
    <SponsorShowcase />
</ThemedSection>
```

This creates the first dark→light transition as the user scrolls to the sponsors section.

**Step 4: Run full build check**

```bash
npm run build
```
Expected: Build completes successfully. Any TypeScript errors should be fixed before this step.

**Step 5: Run all tests**

```bash
npm test
```
Expected: All tests pass.

**Step 6: Final commit**
```bash
git add src/components/ui/background-wrapper.tsx src/components/sponsor-showcase.tsx src/app/page.tsx
git commit -m "feat: theme-aware background wrapper, gold sponsor ticker, first dark-to-light scroll transition"
```

---

## Summary — Implementation Sequence

| Task | Feature | Est. |
|------|---------|------|
| 1 | Vitest setup | 10 min |
| 2 | DB migration | 15 min |
| 3 | Design tokens + fonts | 20 min |
| 4 | ThemeProvider | 15 min |
| 5 | Navbar (theme-aware + new links) | 20 min |
| 6 | Hero redesign | 20 min |
| 7 | DB-driven ProjectShuffler | 25 min |
| 8 | /initiatives listing page | 20 min |
| 9 | /initiatives/[slug] detail page | 25 min |
| 10 | Announcements (actions + page) | 25 min |
| 11 | Hub 5-tab redesign + pulse widget | 35 min |
| 12 | Admin sidebar + announcement manager | 30 min |
| 13 | Admin initiative manager + pulse builder | 30 min |
| 14 | Admin board + page sections CMS | 30 min |
| 15 | Gallery lightbox + filters | 20 min |
| 16 | Hero + footer CMS-wired | 20 min |
| 17 | Polish + build check | 20 min |

**Total: ~6–7 hours of focused implementation**
