"use client";

import { useEffect } from "react";

/**
 * Cinematic scroll house — progressive enhancement.
 * - Top reading progress (scroll-driven where supported)
 * - Section soft parallax on [.cinema-section] using IntersectionObserver + rAF
 * Content stays visible without JS; motion only enhances.
 */
export function ScrollCinema() {
    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) return;

        const bar = document.getElementById("cinema-progress");
        const onScroll = () => {
            if (!bar) return;
            const el = document.documentElement;
            const max = el.scrollHeight - el.clientHeight;
            const p = max > 0 ? el.scrollTop / max : 0;
            bar.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        const sections = Array.from(
            document.querySelectorAll<HTMLElement>(".cinema-section")
        );

        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("cinema-in");
                    }
                }
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
        );

        sections.forEach((s) => {
            s.classList.add("cinema-ready");
            io.observe(s);
        });

        return () => {
            window.removeEventListener("scroll", onScroll);
            io.disconnect();
        };
    }, []);

    return (
        <div
            id="cinema-progress"
            className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left scale-x-0 bg-accent-cranberry pointer-events-none"
            aria-hidden
        />
    );
}
