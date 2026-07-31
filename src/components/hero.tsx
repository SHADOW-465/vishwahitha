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

export const Hero = ({
    headlineLine1 = "Rotaract Club of Vishwahita",
    headlineLine2 = "Universal friendship, youth-led service.",
    subtext = "Chartered 10 March 1999 · Sponsored by the Rotary Club of Madras Industrial City · RI District 3234, Group 01, Chennai. Apply below — the board will follow up.",
}: HeroProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const reduce =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (reduce) return;

        const ctx = gsap.context(() => {
            gsap.from(".hero-reveal", {
                y: 40,
                opacity: 0,
                filter: "blur(6px)",
                duration: 1.1,
                stagger: 0.12,
                ease: "power4.out",
                delay: 0.35,
                clearProps: "filter",
            });

            gsap.from(".hero-scroll-indicator", {
                opacity: 0,
                y: 8,
                duration: 0.8,
                delay: 1.2,
                ease: "power2.out",
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="hero"
            ref={containerRef}
            className="relative w-full min-h-[100dvh] flex items-center justify-start overflow-hidden bg-transparent pt-24"
        >
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-primary to-transparent z-10 pointer-events-none" />

            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 py-12 md:py-20">
                <div className="max-w-5xl space-y-6 min-w-0">
                    <p className="hero-reveal font-mono text-[10px] md:text-xs text-accent-gold uppercase tracking-[0.22em] font-medium">
                        RI District 3234 · Group 01 · Chennai
                    </p>

                    <div className="space-y-2 sm:space-y-3 min-w-0">
                        <h1 className="hero-reveal font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tighter leading-[0.92] text-text-primary text-balance break-words min-w-0">
                            {headlineLine1}
                        </h1>
                        <p className="hero-reveal font-display-drama text-[2.25rem] sm:text-[3.5rem] md:text-[5.5rem] lg:text-[6.5rem] leading-[0.85] text-accent-gold tracking-tight pb-2 text-balance break-words min-w-0">
                            {headlineLine2}
                        </p>
                    </div>

                    <p className="hero-reveal text-sm sm:text-base md:text-lg text-text-secondary font-heading max-w-xl leading-relaxed pt-2">
                        {subtext}
                    </p>

                    <div className="hero-reveal flex flex-wrap items-center gap-3 sm:gap-4 pt-6">
                        <MagneticButton>
                            <Link
                                href="/#join"
                                className="group relative overflow-hidden inline-flex items-center gap-2.5 bg-accent-cranberry text-text-primary font-bold text-sm px-8 py-4 rounded-full transition-all duration-300 shadow-lg shadow-accent-cranberry/20 hover:shadow-accent-cranberry/30 hover:bg-[#e01872] whitespace-nowrap"
                            >
                                <span className="relative z-10">Apply to join</span>
                                <ArrowRight
                                    size={16}
                                    className="relative z-10 group-hover:translate-x-1 transition-transform"
                                />
                            </Link>
                        </MagneticButton>

                        <MagneticButton>
                            <Link
                                href="/events"
                                className="inline-flex items-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 text-text-primary font-medium text-sm px-8 py-4 rounded-full transition-colors whitespace-nowrap"
                            >
                                See events
                            </Link>
                        </MagneticButton>
                    </div>

                    <p className="hero-reveal font-mono text-[11px] text-text-secondary pt-1">
                        Already inducted?{" "}
                        <Link href="/sign-in" className="text-accent-gold hover:underline">
                            Member sign-in
                        </Link>
                    </p>
                </div>
            </div>

            <div className="hero-scroll-indicator absolute bottom-12 right-12 z-20 hidden md:flex flex-col items-center gap-3 opacity-30">
                <span className="font-mono text-[9px] text-text-secondary uppercase tracking-[0.3em]">
                    Scroll
                </span>
                <div className="w-px h-16 bg-gradient-to-b from-accent-gold to-transparent" />
            </div>
        </section>
    );
};
