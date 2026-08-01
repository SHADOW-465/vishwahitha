"use client";

import { useEffect, useRef, useState } from "react";

interface SignatureTextProps {
    /** The words to sign. */
    children: string;
    /** Extra classes for the type itself (size, colour). */
    className?: string;
    /** Milliseconds to wait after the element enters view. Used to run a
     *  sequence of signatures one after another. */
    delay?: number;
    /** Seconds per character. Longer names take longer to write, the way a
     *  real hand does — a fixed duration makes short names crawl. */
    pace?: number;
    /** Rendered element. Headings should pass "h2"/"h3" so the signature is
     *  still a heading to a screen reader. */
    as?: "span" | "h1" | "h2" | "h3" | "p";
}

/**
 * Text that writes itself on, once, when scrolled into view.
 *
 * Owns its own IntersectionObserver rather than leaning on the homepage
 * ChapterRail, so it works identically on /about and on project pages.
 *
 * Authentic stroke-path signing needs hand-drawn SVG path data per name,
 * which can't work for names the board adds through the CMS later. This
 * inks a real signature face behind a soft-edged travelling mask instead:
 * same read, works for any string.
 *
 * ponytail: CSS animation + one observer. No motion library for this.
 */
export function SignatureText({
    children,
    className = "",
    delay = 0,
    pace = 0.115,
    as: Tag = "span",
}: SignatureTextProps) {
    const ref = useRef<HTMLElement>(null);
    // Starts false so the server render and the no-JS render are fully inked.
    const [pending, setPending] = useState(false);
    const [signing, setSigning] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        // Only now is it safe to hide the ink: JS is running.
        setPending(true);

        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                io.disconnect();
                window.setTimeout(() => setSigning(true), delay);
            },
            { threshold: 0.4, rootMargin: "0px 0px -8% 0px" }
        );
        io.observe(el);

        // If the observer never fires (hidden tab, headless render), ink it in
        // anyway rather than leaving a blank line where a heading belongs.
        const failsafe = window.setTimeout(() => setSigning(true), 5000 + delay);

        return () => {
            io.disconnect();
            window.clearTimeout(failsafe);
        };
    }, [delay]);

    // Clamped so a one-word name still feels written and a long one doesn't drag.
    const duration = Math.min(3.2, Math.max(1.1, children.length * pace));

    return (
        <Tag
            ref={ref as React.Ref<never>}
            className={`signature-ink relative inline-block font-signature ${
                pending && !signing ? "is-pending" : ""
            } ${signing ? "is-signing" : ""} ${className}`}
            style={{ "--sign-dur": `${duration}s` } as React.CSSProperties}
        >
            {children}
            {/* The nib. Decorative — the text above is the content. */}
            <span
                className="signature-nib pointer-events-none absolute bottom-[0.18em] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent-gold shadow-[0_0_10px_3px_rgba(212,175,55,0.55)]"
                aria-hidden
            />
        </Tag>
    );
}
