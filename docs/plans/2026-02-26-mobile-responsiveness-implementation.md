# Mobile Responsiveness Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make every page and component work correctly on mobile (360px+) and tablet (640px+) without changing the cinematic noir/gold aesthetic.

**Architecture:** Pure Tailwind class changes + Framer Motion `AnimatePresence` for the navbar dropdown and admin sidebar toggle. No new dependencies. No data layer changes.

**Tech Stack:** Next.js 16, Framer Motion (already installed), lucide-react (already installed), Tailwind CSS

---

## Task 1: Navbar — Mobile Hamburger Dropdown

**Files:**
- Modify: `src/components/navbar.tsx`

No test file needed — manually verify at 390px and 1024px after implementation.

**Step 1: Replace navbar.tsx with the mobile-ready version**

Replace the entire contents of `src/components/navbar.tsx` with:

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { MagneticButton } from "./ui/magnetic-button";
import { useTheme } from "@/components/theme-provider";

const LAST_SEEN_KEY = "vishwahitha_announcements_last_seen";

export const Navbar = () => {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.role === "admin";
    const { theme } = useTheme();
    const isLight = theme === "light";
    const navRef = useRef<HTMLElement>(null);

    const [badgeCount, setBadgeCount] = useState(0);
    useEffect(() => {
        const lastSeen = localStorage.getItem(LAST_SEEN_KEY);
        if (!lastSeen) { setBadgeCount(3); return; }
    }, [user]);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    // Close dropdown on outside click
    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [menuOpen]);

    const linkClass = `text-sm font-medium transition-colors duration-300 inline-block hover:-translate-y-[1px] ${isLight
        ? "text-text-primary-light hover:text-[#B8860B]"
        : "text-text-secondary hover:text-text-primary"
    }`;

    const pillBg = scrolled
        ? isLight
            ? "bg-white/80 backdrop-blur-2xl border border-black/10 shadow-xl"
            : "bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl"
        : "bg-transparent border-transparent";

    const pillRadius = menuOpen ? "rounded-3xl" : "rounded-[3rem]";

    return (
        <motion.header
            ref={navRef as React.Ref<HTMLElement>}
            className={`fixed top-4 md:top-6 left-1/2 z-50 transition-all duration-500 ${pillRadius} px-4 md:px-6 py-2.5 md:py-3 flex flex-col w-[calc(100vw-2rem)] md:w-max max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-2rem)]`}
            style={{ background: "transparent" }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            initial={{ y: -100, x: "-50%", opacity: 0 }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
        >
            {/* Pill background */}
            <motion.div
                className={`absolute inset-0 transition-all duration-500 ${pillRadius} ${pillBg}`}
                aria-hidden
            />

            {/* Top row: logo + desktop nav + auth + hamburger */}
            <div className="relative z-10 flex items-center justify-between gap-4 md:gap-8">
                {/* Logo */}
                <Link href="/" className="font-heading font-bold text-lg md:text-xl tracking-tighter gold-text shrink-0">
                    VISHWAHITA
                </Link>

                {/* Desktop nav links */}
                <nav className="hidden lg:flex items-center gap-3 lg:gap-5">
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

                {/* Auth + hamburger */}
                <div className="flex items-center gap-3 shrink-0">
                    <SignedOut>
                        <MagneticButton>
                            <Link
                                href="/sign-up"
                                className="bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-bold tracking-wide hover:scale-[1.03] transition-transform duration-300 inline-block"
                            >
                                Join Us
                            </Link>
                        </MagneticButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton
                            appearance={{
                                variables: { colorPrimary: '#C9A84C' },
                                elements: { userButtonAvatarBox: "w-8 h-8 md:w-9 md:h-9 border-2 border-accent-gold/30" }
                            }}
                        />
                    </SignedIn>
                    {/* Hamburger — mobile/tablet only */}
                    <button
                        className="lg:hidden p-1.5 rounded-xl text-text-secondary hover:text-text-primary transition-colors"
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-label="Toggle navigation menu"
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown nav */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.nav
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                        className="overflow-hidden lg:hidden relative z-10"
                    >
                        <div className="flex flex-col gap-0.5 pt-3 pb-2 border-t border-white/10 mt-2">
                            {[
                                { href: "/about", label: "About" },
                                { href: "/initiatives", label: "Initiatives" },
                                { href: "/gallery", label: "Gallery" },
                                { href: "/announcements", label: "Announcements" },
                            ].map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setMenuOpen(false)}
                                    className={`${linkClass} py-2.5 px-2 rounded-xl flex items-center gap-2`}
                                >
                                    {label}
                                    {label === "Announcements" && badgeCount > 0 && (
                                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-accent-red text-white text-[9px] font-bold animate-pulse">
                                            {badgeCount}
                                        </span>
                                    )}
                                </Link>
                            ))}
                            <SignedIn>
                                <Link
                                    href="/hub"
                                    onClick={() => setMenuOpen(false)}
                                    className={`${linkClass} py-2.5 px-2 rounded-xl`}
                                >
                                    Hub
                                </Link>
                            </SignedIn>
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    onClick={() => setMenuOpen(false)}
                                    className="text-sm font-medium gold-text hover:opacity-80 transition-opacity py-2.5 px-2 rounded-xl"
                                >
                                    Admin
                                </Link>
                            )}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </motion.header>
    );
};
```

**Step 2: Run the smoke test to confirm nothing broke**

```bash
node node_modules/vitest/vitest.mjs run src/test/smoke.test.ts
```

Expected: PASS (or same result as before this change)

**Step 3: Commit**

```bash
git add src/components/navbar.tsx
git commit -m "feat: add mobile hamburger dropdown to navbar"
```

---

## Task 2: Hero — Scale Typography and Padding for Mobile

**Files:**
- Modify: `src/components/hero.tsx`

**Step 1: Apply the following targeted edits**

In `src/components/hero.tsx`:

Change line 53 (vignette blob):
```tsx
// FROM:
<div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-accent-gold/5 blur-[120px] z-20 rounded-full" />
// TO:
<div className="absolute bottom-0 left-0 w-full sm:w-[600px] h-[300px] sm:h-[400px] bg-accent-gold/5 blur-[120px] z-20 rounded-full" />
```

Change line 57 (content padding):
```tsx
// FROM:
<div className="relative z-30 w-full max-w-7xl mx-auto px-6 pt-40 pb-20 md:pt-48 md:pb-32">
// TO:
<div className="relative z-30 w-full max-w-7xl mx-auto px-5 pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-24 lg:pt-48 lg:pb-32">
```

Change line 66 (headline text):
```tsx
// FROM:
<h1 className="hero-reveal font-heading font-bold text-5xl md:text-7xl lg:text-8xl text-text-primary tracking-tighter leading-[0.95]">
// TO:
<h1 className="hero-reveal font-heading font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-text-primary tracking-tighter leading-[0.95]">
```

Change line 70 (drama text — the biggest offender):
```tsx
// FROM:
<h1 className="hero-reveal font-drama italic font-light text-[5rem] md:text-[9rem] lg:text-[11rem] leading-[0.8] gold-text tracking-tight">
// TO:
<h1 className="hero-reveal font-drama italic font-light text-[3rem] sm:text-[4.5rem] md:text-[7rem] lg:text-[9rem] xl:text-[11rem] leading-[0.8] gold-text tracking-tight">
```

**Step 2: Run smoke test**

```bash
node node_modules/vitest/vitest.mjs run src/test/smoke.test.ts
```

Expected: PASS

**Step 3: Commit**

```bash
git add src/components/hero.tsx
git commit -m "fix: scale hero typography and padding for mobile"
```

---

## Task 3: Admin Shell — Collapsible Mobile Sidebar

**Files:**
- Modify: `src/components/admin/admin-shell.tsx`

**Step 1: Replace the entire file contents**

```tsx
"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Megaphone, Zap, Calendar, Image, Users, FileText, BarChart2, Radio, Menu, X } from "lucide-react";

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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const activeItem = NAV_ITEMS.find((i) => i.id === active);

    return (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 min-h-[80vh]">
            {/* Mobile sidebar toggle */}
            <div className="md:hidden">
                <button
                    onClick={() => setSidebarOpen((o) => !o)}
                    className="flex items-center gap-3 w-full glass-panel rounded-2xl px-4 py-3 text-left font-mono text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                    {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
                    <span className="flex-1">{activeItem?.label ?? "Menu"}</span>
                    {activeItem && <activeItem.icon size={16} className="text-accent-gold" />}
                </button>

                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                            className="overflow-hidden"
                        >
                            <div className="pt-2 space-y-1">
                                {NAV_ITEMS.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => { setActive(item.id); setSidebarOpen(false); }}
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
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Desktop sidebar — always visible on md+ */}
            <aside className="hidden md:block w-56 flex-shrink-0 space-y-1">
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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
                                    className="glass-panel rounded-2xl p-4 md:p-6"
                                >
                                    <p className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mb-2">{stat.label}</p>
                                    <p className={`font-heading text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</p>
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

**Step 2: Run smoke test**

```bash
node node_modules/vitest/vitest.mjs run src/test/smoke.test.ts
```

Expected: PASS

**Step 3: Commit**

```bash
git add src/components/admin/admin-shell.tsx
git commit -m "feat: make admin sidebar collapsible on mobile"
```

---

## Task 4: Footer Mobile Padding

**Files:**
- Modify: `src/components/footer.tsx`

**Step 1: Apply targeted edits**

In `src/components/footer.tsx`:

Change line 9 (footer outer padding and margin):
```tsx
// FROM:
<footer className="w-full bg-primary border-t border-white/5 pt-20 pb-10 px-6 mt-32 relative overflow-hidden">
// TO:
<footer className="w-full bg-primary border-t border-white/5 pt-12 pb-8 px-5 mt-16 md:pt-20 md:pb-10 md:px-6 md:mt-32 relative overflow-hidden">
```

Change line 12 (footer grid):
```tsx
// FROM:
<div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
// TO:
<div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
```

**Step 2: Run smoke test**

```bash
node node_modules/vitest/vitest.mjs run src/test/smoke.test.ts
```

Expected: PASS

**Step 3: Commit**

```bash
git add src/components/footer.tsx
git commit -m "fix: reduce footer padding and add sm: grid step for mobile"
```

---

## Task 5: Page-Level Padding — About and Hub

**Files:**
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/hub/page.tsx`

**Step 1: Edit about/page.tsx**

Change line 19:
```tsx
// FROM:
<div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-24">
// TO:
<div className="min-h-screen pt-24 pb-16 px-5 md:pt-32 md:pb-24 md:px-6 max-w-7xl mx-auto space-y-16 md:space-y-24">
```

Change line 20 (story section padding):
```tsx
// FROM:
<section className="glass-panel rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
// TO:
<section className="glass-panel rounded-[2rem] md:rounded-[2.5rem] p-5 sm:p-8 md:p-16 relative overflow-hidden">
```

Change line 21 (accent blob):
```tsx
// FROM:
<div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent-gold/5 blur-[80px]" />
// TO:
<div className="absolute -top-10 -right-10 w-40 h-40 md:w-64 md:h-64 rounded-full bg-accent-gold/5 blur-[80px]" />
```

Change line 38 (board grid):
```tsx
// FROM:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// TO:
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
```

**Step 2: Edit hub/page.tsx**

Change line 44:
```tsx
// FROM:
<div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
// TO:
<div className="min-h-screen pt-24 pb-16 px-5 md:pt-32 md:pb-24 md:px-6 max-w-7xl mx-auto">
```

**Step 3: Run smoke test**

```bash
node node_modules/vitest/vitest.mjs run src/test/smoke.test.ts
```

Expected: PASS

**Step 4: Commit**

```bash
git add src/app/about/page.tsx src/app/hub/page.tsx
git commit -m "fix: reduce page-level padding on about and hub for mobile"
```

---

## Task 6: Component Padding — Cards and Hub Tabs

**Files:**
- Modify: `src/components/announcement-card.tsx`
- Modify: `src/components/initiative-card.tsx`
- Modify: `src/components/hub-tabs.tsx`

**Step 1: Edit announcement-card.tsx**

Change line 30:
```tsx
// FROM:
className={`glass-panel rounded-3xl p-8 ${a.is_pinned ? "border-accent-gold/30" : ""}`}
// TO:
className={`glass-panel rounded-2xl md:rounded-3xl p-5 md:p-8 ${a.is_pinned ? "border-accent-gold/30" : ""}`}
```

**Step 2: Edit initiative-card.tsx**

Change line 65 (placeholder text):
```tsx
// FROM:
<span className="font-drama italic text-5xl gold-text opacity-30">{initiative.title[0]}</span>
// TO:
<span className="font-drama italic text-4xl md:text-5xl gold-text opacity-30">{initiative.title[0]}</span>
```

Change line 69 (card body padding):
```tsx
// FROM:
<div className="p-8">
// TO:
<div className="p-5 md:p-8">
```

**Step 3: Edit hub-tabs.tsx**

Change line 78 (My Events RSVP row — stacks on mobile):
```tsx
// FROM:
<div key={rsvp.id} className="glass-panel rounded-2xl p-6 flex items-center justify-between">
// TO:
<div key={rsvp.id} className="glass-panel rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
```

Change line 105 (Weekly Pulse container):
```tsx
// FROM:
<div className="glass-panel rounded-3xl p-8">
// TO:
<div className="glass-panel rounded-2xl md:rounded-3xl p-5 md:p-8">
```

**Step 4: Run smoke test**

```bash
node node_modules/vitest/vitest.mjs run src/test/smoke.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/components/announcement-card.tsx src/components/initiative-card.tsx src/components/hub-tabs.tsx
git commit -m "fix: reduce card padding on mobile for announcements, initiatives, hub"
```

---

## Task 7: Project Shuffler — Grid and Card Height

**Files:**
- Modify: `src/components/project-shuffler.tsx`

**Step 1: Apply targeted edits**

Change line 36 (grid):
```tsx
// FROM:
<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
// TO:
<div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
```

Change line 38 (heading):
```tsx
// FROM:
<h2 className="text-4xl md:text-6xl font-heading font-bold text-text-primary">
// TO:
<h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-text-primary">
```

Change line 40 (drama sub-heading):
```tsx
// FROM:
<span className="font-drama italic gold-text font-light text-5xl md:text-7xl">Artifacts</span>
// TO:
<span className="font-drama italic gold-text font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl">Artifacts</span>
```

Change line 60 (card stack container height):
```tsx
// FROM:
<div
    className="relative h-[420px] w-full flex items-center justify-center cursor-pointer"
// TO:
<div
    className="relative h-[320px] sm:h-[380px] md:h-[420px] w-full flex items-center justify-center cursor-pointer"
```

**Step 2: Run smoke test**

```bash
node node_modules/vitest/vitest.mjs run src/test/smoke.test.ts
```

Expected: PASS

**Step 3: Commit**

```bash
git add src/components/project-shuffler.tsx
git commit -m "fix: make project shuffler grid and card height responsive"
```

---

## Task 8: Sponsor Showcase — Shrink Mobile Gradient Masks

**Files:**
- Modify: `src/components/sponsor-showcase.tsx`

**Step 1: Apply targeted edits**

Change line 59 (left mask):
```tsx
// FROM:
<div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
// TO:
<div className="absolute inset-y-0 left-0 w-12 sm:w-24 md:w-40 bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
```

Change line 60 (right mask):
```tsx
// FROM:
<div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />
// TO:
<div className="absolute inset-y-0 right-0 w-12 sm:w-24 md:w-40 bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />
```

Also change line 51 (sponsor text size):
```tsx
// FROM:
<span className="font-heading font-black text-2xl md:text-3xl text-white/20 ...">
// TO:
<span className="font-heading font-black text-lg sm:text-2xl md:text-3xl text-white/20 ...">
```

**Step 2: Run smoke test**

```bash
node node_modules/vitest/vitest.mjs run src/test/smoke.test.ts
```

Expected: PASS

**Step 3: Commit**

```bash
git add src/components/sponsor-showcase.tsx
git commit -m "fix: shrink sponsor showcase gradient masks on mobile"
```

---

## Task 9: Final Verification

**Step 1: Run all tests**

```bash
node node_modules/vitest/vitest.mjs run
```

Expected: All PASS

**Step 2: Build to check for TypeScript errors**

```bash
node node_modules/next/dist/bin/next build
```

Expected: Build completes with no errors.

**Step 3: Manual viewport checks**

Start dev server:
```bash
node node_modules/next/dist/bin/next dev
```

Open browser DevTools → toggle device toolbar and verify at these widths:

| Width | Key things to verify |
|-------|---------------------|
| 360px | Hamburger appears, hero text fits, no horizontal scroll |
| 390px | iPhone 15 — hero looks good, footer stacks |
| 768px | iPad — admin sidebar visible on desktop mode, 2-col grids |
| 1024px | Hamburger disappears, desktop nav appears |

**Step 4: Final commit if any small fixes were needed**

```bash
git add -p
git commit -m "fix: mobile responsiveness polish from visual review"
```
