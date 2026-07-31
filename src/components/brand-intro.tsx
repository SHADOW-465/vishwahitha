"use client";

import { useEffect, useState } from "react";
import { ClubLogoMark } from "@/components/club-logo";

const KEY = "vishwahita_brand_intro_seen";

/**
 * First-load deliberate brand moment (session) — official club logo intro.
 */
export function BrandIntro() {
    const [visible, setVisible] = useState(false);
    const [logoMounted, setLogoMounted] = useState(false);
    const [showText, setShowText] = useState(false);
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
        // Stage 1: Logo fades & scales in alone
        const logoTimer = window.setTimeout(() => setLogoMounted(true), 80);

        // Stage 2: Text smoothly reveals after logo has stood alone deliberately
        const textTimer = window.setTimeout(() => setShowText(true), 1500);

        // Stage 3: Dismiss after deliberate duration (~3.2s)
        const dismiss = () => {
            setExiting(true);
            try {
                sessionStorage.setItem(KEY, "1");
            } catch {
                /* ignore */
            }
            window.setTimeout(() => setVisible(false), 900);
        };

        const autoDismissTimer = window.setTimeout(dismiss, 3200);

        const onScroll = () => {
            if (window.scrollY > 8) dismiss();
        };
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.clearTimeout(logoTimer);
            window.clearTimeout(textTimer);
            window.clearTimeout(autoDismissTimer);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-primary transition-all duration-900 ease-in-out ${
                exiting ? "opacity-0 backdrop-blur-none scale-105 pointer-events-none" : "opacity-100 backdrop-blur-md"
            }`}
            aria-hidden
        >
            {/* Ambient gold glow behind logo */}
            <div className="absolute w-72 h-72 rounded-full bg-accent-gold/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 text-center px-6 space-y-6 flex flex-col items-center">
                {/* Logo alone moment */}
                <div
                    className={`transform transition-all duration-1000 ease-out ${
                        logoMounted ? "opacity-100 scale-100" : "opacity-0 scale-90"
                    }`}
                >
                    <ClubLogoMark size={140} priority className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-[0_10px_25px_rgba(212,175,55,0.25)]" />
                </div>

                {/* Staged text reveal */}
                <div
                    className={`space-y-3 transform transition-all duration-1000 ease-out ${
                        showText ? "opacity-100 translate-y-0 max-h-40" : "opacity-0 translate-y-4 max-h-0 overflow-hidden"
                    }`}
                >
                    <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent-gold">
                        RI District 3234
                    </p>
                    <p className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tighter text-text-primary">
                        Rotaract Club of Vishwahita
                    </p>
                    <p className="font-display-drama text-xl sm:text-2xl gold-text italic">
                        Unite for Good
                    </p>
                </div>
            </div>
        </div>
    );
}

