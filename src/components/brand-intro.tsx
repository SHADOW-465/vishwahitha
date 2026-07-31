"use client";

import { useEffect, useState } from "react";
import { ClubLogoMark } from "@/components/club-logo";

const KEY = "vishwahita_brand_intro_seen";

/**
 * First-load brand moment (session) — official club logo.
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

        const t = window.setTimeout(dismiss, 1600);
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
            <div className="text-center px-6 space-y-5">
                <div className="mx-auto flex justify-center">
                    <ClubLogoMark size={120} priority className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-lg" />
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
