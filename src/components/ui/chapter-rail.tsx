"use client";

import { useEffect, useState } from "react";

export interface Act {
    id: string;
    label: string;
}

/**
 * The Charter Ledger rail — the one persistent element that makes the page
 * read as a story rather than a stack of sections. Names the act you're in,
 * tracks how far through the record you are.
 *
 * Doubles as the page's reveal driver: one IntersectionObserver for every
 * [data-reveal] on the page rather than one per section.
 *
 * ponytail: IntersectionObserver, not scroll listeners or a scroll library.
 */
export function ChapterRail({ acts }: { acts: Act[] }) {
    const [active, setActive] = useState(0);
    const [progress, setProgress] = useState(0);

    // Reveals. Separate effect so it isn't re-run when acts change identity.
    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");

        // Opt in to the hidden start state only now that JS is running, so a
        // failed observer or a headless render can never ship a blank page.
        if (!reduce) document.documentElement.classList.add("js-reveal");
        if (reduce) {
            targets.forEach((el) => el.classList.add("is-in"));
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target as HTMLElement;
                    // Stagger only within a group, never across the page.
                    const delay = Number(el.dataset.revealDelay ?? 0);
                    window.setTimeout(() => el.classList.add("is-in"), delay);
                    io.unobserve(el);
                });
            },
            { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
        );

        targets.forEach((el) => io.observe(el));

        // Safety net: anything still hidden after 4s gets shown regardless.
        const failsafe = window.setTimeout(() => {
            targets.forEach((el) => el.classList.add("is-in"));
        }, 4000);

        return () => {
            io.disconnect();
            window.clearTimeout(failsafe);
        };
    }, []);

    // Which act are we in.
    useEffect(() => {
        const sections = acts
            .map((a) => document.getElementById(a.id))
            .filter((el): el is HTMLElement => Boolean(el));

        if (sections.length === 0) return;

        const io = new IntersectionObserver(
            (entries) => {
                // Most-visible section wins; avoids flicker at boundaries.
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (!visible) return;
                const index = sections.indexOf(visible.target as HTMLElement);
                if (index >= 0) setActive(index);
            },
            { rootMargin: "-35% 0px -35% 0px", threshold: [0, 0.25, 0.5, 1] }
        );

        sections.forEach((el) => io.observe(el));

        let frame = 0;
        const onScroll = () => {
            if (frame) return;
            frame = window.requestAnimationFrame(() => {
                frame = 0;
                const max = document.documentElement.scrollHeight - window.innerHeight;
                setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
            });
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            io.disconnect();
            window.removeEventListener("scroll", onScroll);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, [acts]);

    return (
        <>
            {/* Below xl there is no room beside the content for a rail, so the
                act structure degrades to a single hairline of progress. */}
            <div
                className="xl:hidden fixed top-0 inset-x-0 h-px bg-transparent pointer-events-none"
                style={{ zIndex: "var(--z-rail)" }}
                aria-hidden
            >
                <div
                    className="h-full bg-accent-gold origin-left transition-transform duration-150 ease-out"
                    style={{ transform: `scaleX(${progress})` }}
                />
            </div>

            {/* Desktop: the ledger. */}
            <nav
                aria-label="Page sections"
                className="hidden xl:block fixed left-6 top-1/2 -translate-y-1/2 pointer-events-auto"
                style={{ zIndex: "var(--z-rail)" }}
            >
                <ol className="relative flex flex-col gap-7 pl-5">
                    {/* The rule the entries hang from. */}
                    <span
                        className="absolute left-0 top-1 bottom-1 w-px bg-white/10"
                        aria-hidden
                    />
                    <span
                        className="absolute left-0 top-1 w-px bg-accent-gold origin-top transition-transform duration-300 ease-out"
                        style={{
                            height: "calc(100% - 0.5rem)",
                            transform: `scaleY(${(active + 1) / acts.length})`,
                        }}
                        aria-hidden
                    />
                    {acts.map((act, i) => {
                        const isActive = i === active;
                        return (
                            <li key={act.id} className="relative leading-none">
                                <a
                                    href={`#${act.id}`}
                                    aria-current={isActive ? "true" : undefined}
                                    className={`group block font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${
                                        isActive
                                            ? "text-text-primary translate-x-1"
                                            : "text-text-secondary hover:text-text-primary"
                                    }`}
                                >
                                    <span
                                        className={`absolute -left-5 top-1/2 -translate-y-1/2 block rounded-full transition-all duration-500 ${
                                            isActive
                                                ? "w-1.5 h-1.5 -ml-[2.5px] bg-accent-gold"
                                                : "w-px h-px ml-0 bg-white/30 group-hover:bg-white/60"
                                        }`}
                                        aria-hidden
                                    />
                                    {act.label}
                                </a>
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
}
