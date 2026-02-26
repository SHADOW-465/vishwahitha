"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { MagneticButton } from "./ui/magnetic-button";

interface HeroProps {
    headline?: string;
    subtext?: string;
}

export const Hero = ({
    headline = "Service Above",
    subtext = "Community Luxe — merging high-end execution with dedicated NGO roots. District 3232.",
}: HeroProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Staggered reveal — each .hero-reveal element animates up
            gsap.from(".hero-reveal", {
                y: 70,
                opacity: 0,
                duration: 1.4,
                stagger: 0.12,
                ease: "power4.out",
                delay: 0.3,
            });
            // Subtle scale-in on the badge
            gsap.from(".hero-badge", {
                scale: 0.7,
                opacity: 0,
                duration: 0.8,
                ease: "back.out(1.7)",
                delay: 0.1,
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative w-full h-[100dvh] flex items-end justify-start overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593113565694-c6c703b44b82?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-25 grayscale z-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/85 to-primary/40 z-10" />
                {/* Gold vignette at bottom */}
                <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-accent-gold/5 blur-[120px] z-20 rounded-full" />
            </div>

            {/* Content */}
            <div className="relative z-30 w-full max-w-7xl mx-auto px-6 pb-28 md:pb-36">
                {/* Rotaract badge */}
                <div className="hero-badge inline-flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/25 rounded-full px-4 py-1.5 mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
                    <span className="font-mono text-xs text-accent-gold uppercase tracking-[0.2em]">Rotaract Club of Vishwahita</span>
                </div>

                <div className="max-w-4xl space-y-4">
                    {/* Line 1 — bold sans */}
                    <h1 className="hero-reveal font-heading font-bold text-5xl md:text-7xl lg:text-8xl text-text-primary tracking-tighter leading-[0.95]">
                        {headline}
                    </h1>
                    {/* Line 2 — massive drama serif gold */}
                    <h1 className="hero-reveal font-drama italic font-light text-[5rem] md:text-[9rem] lg:text-[11rem] leading-[0.8] gold-text tracking-tight">
                        Self.
                    </h1>

                    <p className="hero-reveal text-base md:text-xl text-text-secondary font-mono max-w-lg leading-relaxed pt-4">
                        {subtext}
                    </p>

                    <div className="hero-reveal flex items-center gap-4 pt-6">
                        <MagneticButton>
                            <Link
                                href="/initiatives"
                                className="inline-block bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold text-sm px-7 py-3.5 rounded-full hover:scale-[1.04] transition-transform duration-300"
                            >
                                Our Initiatives
                            </Link>
                        </MagneticButton>
                        <MagneticButton>
                            <Link
                                href="/about"
                                className="inline-block border border-white/20 text-text-primary font-medium text-sm px-7 py-3.5 rounded-full hover:bg-white/5 transition-colors"
                            >
                                Who We Are
                            </Link>
                        </MagneticButton>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="hero-reveal absolute bottom-8 right-8 z-30 flex flex-col items-center gap-2 opacity-40">
                <span className="font-mono text-[10px] text-text-secondary uppercase tracking-[0.3em]">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-accent-gold/60 to-transparent" />
            </div>
        </section>
    );
};
