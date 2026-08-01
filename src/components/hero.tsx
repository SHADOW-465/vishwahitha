"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "./ui/magnetic-button";

interface HeroProps {
    headlineLine1?: string;
    headlineLine2?: string;
    subtext?: string;
}

/**
 * Act I · the opening shot.
 *
 * One h1 in two voices, not two competing h1 elements. The display size is
 * capped at 5.5rem (--step-5): the old 9rem clamp overflowed on tablet with
 * the real CMS copy, and past ~6rem a headline is shouting rather than
 * leading.
 */
export const Hero = ({
    headlineLine1 = "Rotaract Club of Vishwahita:",
    headlineLine2 = "27 Years of Youth-Led Service in Chennai.",
    subtext = "Chartered on March 10, 1999, and sponsored by the Rotary Club of Madras Industrial City, we are one of the most active Rotaract clubs in District 3234 — 500+ projects, 2,000+ people reached, one club.",
}: HeroProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) return;

        const ctx = gsap.context(() => {
            // The page's one orchestrated entrance. Everything below the fold
            // reveals on scroll instead, so this stays the only choreography.
            gsap.from(".hero-reveal", {
                y: 44,
                opacity: 0,
                duration: 1.3,
                stagger: 0.11,
                ease: "expo.out",
                delay: 0.15,
            });

            gsap.from(".hero-rule", {
                scaleX: 0,
                transformOrigin: "left center",
                duration: 1.6,
                ease: "expo.out",
                delay: 0.5,
            });

            gsap.from(".hero-scroll-indicator", {
                opacity: 0,
                y: 10,
                duration: 1,
                delay: 1.4,
                ease: "power2.out",
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full min-h-[100dvh] flex items-center justify-start overflow-hidden bg-transparent pt-28 pb-16"
        >
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-primary to-transparent z-10 pointer-events-none" />

            <div className="relative z-20 w-full max-w-7xl mx-auto px-6">
                <div className="max-w-5xl min-w-0">
                    <p className="hero-reveal font-mono text-[10px] md:text-[11px] text-gold-ink uppercase tracking-[0.28em]">
                        RI District 3234 · Group 02 · Chennai
                    </p>

                    <span
                        className="hero-rule mt-6 block h-px w-full max-w-md bg-gradient-to-r from-accent-gold/60 to-transparent"
                        aria-hidden
                    />

                    <h1 className="mt-8 min-w-0 text-balance">
                        <span className="hero-reveal block font-heading font-extrabold text-step-5 tracking-[-0.035em] text-text-primary">
                            {headlineLine1}
                        </span>
                        <span className="hero-reveal mt-2 block font-display-drama text-step-5 leading-[0.95] text-gold-ink">
                            {headlineLine2}
                        </span>
                    </h1>

                    <p className="hero-reveal mt-8 text-step-1 text-text-secondary measure leading-relaxed">
                        {subtext}
                    </p>

                    <div className="hero-reveal flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-8 sm:pt-10">
                        <MagneticButton className="w-full sm:w-auto">
                            <Link
                                href="/#join"
                                className="group inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-accent-cranberry to-accent-gold text-white font-bold text-step--1 px-8 py-4 rounded-full transition-shadow duration-300 shadow-lg shadow-accent-cranberry/15 hover:shadow-accent-cranberry/30 whitespace-nowrap w-full sm:w-auto min-h-[44px]"
                            >
                                Become a member
                                <ArrowRight
                                    size={16}
                                    className="group-hover:translate-x-1 transition-transform duration-300"
                                />
                            </Link>
                        </MagneticButton>

                        <MagneticButton className="w-full sm:w-auto">
                            <Link
                                href="/events"
                                className="inline-flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 text-text-primary font-medium text-step--1 px-8 py-4 rounded-full transition-colors whitespace-nowrap w-full sm:w-auto min-h-[44px]"
                            >
                                See what&apos;s on
                            </Link>
                        </MagneticButton>
                    </div>
                </div>
            </div>

            <div className="hero-scroll-indicator absolute bottom-10 right-8 z-20 hidden md:flex flex-col items-center gap-3 opacity-40">
                <span className="font-mono text-[9px] text-text-secondary uppercase tracking-[0.3em]">
                    Scroll
                </span>
                <div className="w-px h-16 bg-gradient-to-b from-accent-gold to-transparent" />
            </div>
        </div>
    );
};
