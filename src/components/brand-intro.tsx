"use client";

import { useEffect, useState } from "react";

const KEY = "vishwahita_brand_intro_seen";

/**
 * P1-1 — First-load brand moment (session).
 * Calm centered logo + name, then fade so sticky nav remains the durable brand.
 */
export function BrandIntro() {
    const [visible, setVisible] = useState(false);
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        try {
            if (sessionStorage.getItem(KEY)) return;
        } catch {
            /* ignore */
        }

        const reduce =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduce) {
            try {
                sessionStorage.setItem(KEY, "1");
            } catch {
                /* ignore */
            }
            return;
        }

        setVisible(true);

        const dismiss = () => {
            setExiting(true);
            try {
                sessionStorage.setItem(KEY, "1");
            } catch {
                /* ignore */
            }
            window.setTimeout(() => setVisible(false), 700);
        };

        const t = window.setTimeout(dismiss, 1400);
        const onScroll = () => {
            if (window.scrollY > 8) dismiss();
        };
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.clearTimeout(t);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-primary transition-opacity duration-700 ${
                exiting ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            aria-hidden
        >
            <div className="text-center px-6 space-y-4">
                <div className="mx-auto w-14 h-14 rounded-full border-2 border-accent-cranberry/80 flex items-center justify-center">
                    <svg className="w-8 h-8 text-accent-cranberry" viewBox="0 0 100 100" fill="currentColor">
                        <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="6" />
                        <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="3" />
                        <circle cx="50" cy="50" r="10" />
                    </svg>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-gold">
                    RI District 3234
                </p>
                <p className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tighter text-text-primary">
                    Rotaract Club of Vishwahita
                </p>
                <p className="font-display-drama text-xl sm:text-2xl gold-text">
                    Unite for Good
                </p>
            </div>
        </div>
    );
}
