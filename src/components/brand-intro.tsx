"use client";

import { useEffect, useState } from "react";
import { ClubLogoMark } from "@/components/club-logo";

const KEY = "vishwahita_brand_intro_seen";

/**
 * P1-1: First paint — logo + club name centered; calm rise into sticky nav space.
 * Not a blocking splash. Overlay fades while the mark lifts toward the nav pill.
 * Honors prefers-reduced-motion; session once-per-tab.
 */
export function BrandIntro() {
    const [phase, setPhase] = useState<"idle" | "enter" | "rise" | "done">("idle");

    useEffect(() => {
        try {
            if (sessionStorage.getItem(KEY)) {
                document.documentElement.dataset.brandIntro = "done";
                return;
            }
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
            document.documentElement.dataset.brandIntro = "done";
            return;
        }

        document.documentElement.dataset.brandIntro = "playing";
        setPhase("enter");

        const tRise = window.setTimeout(() => setPhase("rise"), 700);
        const tDone = window.setTimeout(() => {
            setPhase("done");
            document.documentElement.dataset.brandIntro = "done";
            try {
                sessionStorage.setItem(KEY, "1");
            } catch {
                /* ignore */
            }
        }, 1600);

        const onScroll = () => {
            if (window.scrollY > 12) {
                setPhase("done");
                document.documentElement.dataset.brandIntro = "done";
                try {
                    sessionStorage.setItem(KEY, "1");
                } catch {
                    /* ignore */
                }
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
            window.clearTimeout(tRise);
            window.clearTimeout(tDone);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    if (phase === "idle" || phase === "done") return null;

    const rising = phase === "rise";

    return (
        <div
            className={`fixed inset-0 z-[90] flex pointer-events-none transition-opacity duration-500 ease-out ${
                rising ? "opacity-0" : "opacity-100"
            }`}
            aria-hidden
        >
            <div
                className={`m-auto text-center px-6 space-y-4 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    rising
                        ? "-translate-y-[min(42vh,320px)] scale-[0.42] opacity-0"
                        : "translate-y-0 scale-100 opacity-100"
                }`}
            >
                <div className="mx-auto flex justify-center">
                    <ClubLogoMark
                        size={112}
                        priority
                        className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-lg"
                    />
                </div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-gold">
                    RI District 3234
                </p>
                <p className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tighter text-text-primary">
                    Rotaract Club of Vishwahita
                </p>
            </div>
        </div>
    );
}
