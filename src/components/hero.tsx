"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { MagneticButton } from "./ui/magnetic-button";

interface HeroProps {
    headlineLine1?: string;
    headlineLine2?: string;
    subtext?: string;
}

export const Hero = ({
    headlineLine1 = "27 Years of Youth-Led Service meets",
    headlineLine2 = "Impact.",
    subtext = "Welcome to the Digital Home of Rotaract Vishwahita. Fostering leaders, building lifelong fellowship, and driving sustainable service in Chennai.",
}: HeroProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

    // Spotlight cursor tracking & GSAP entrances
    useEffect(() => {
        const cursor = cursorRef.current;
        
        const handleMouseMove = (e: MouseEvent) => {
            if (!cursor) return;
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out"
            });
        };

        window.addEventListener("mousemove", handleMouseMove);

        const ctx = gsap.context(() => {
            // Reveal text elements
            gsap.from(".hero-reveal", {
                y: 60,
                opacity: 0,
                duration: 1.4,
                stagger: 0.15,
                ease: "power4.out",
                delay: 0.2,
            });

            // Gentle fade-in for scroll indicator
            gsap.from(".hero-scroll-indicator", {
                opacity: 0,
                y: 10,
                duration: 1,
                delay: 1.5,
                ease: "power2.out"
            });
        }, containerRef);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            ctx.revert();
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-[100dvh] flex items-center justify-start overflow-hidden bg-transparent pt-24"
        >
            {/* Custom Mouse Spotlight Glow */}
            <div
                ref={cursorRef}
                className="hidden md:block fixed top-0 left-0 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-gold/5 blur-[120px] pointer-events-none z-0"
                style={{ mixBlendMode: "screen" }}
            />

            {/* Gradient Mask for bottom fade */}
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-primary to-transparent z-10 pointer-events-none" />

            {/* Foreground Content */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 py-12 md:py-20">
                <div className="max-w-4xl space-y-6">
                    {/* Club Name */}
                    <div className="hero-reveal inline-flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/25 rounded-full px-4.5 py-2">
                        <Sparkles size={12} className="text-accent-gold animate-pulse" />
                        <span className="font-mono text-[10px] md:text-xs text-accent-gold uppercase tracking-[0.25em] font-semibold">
                            Rotaract Club of Vishwahita
                        </span>
                    </div>

                    {/* Massive Display Typography */}
                    <div className="space-y-4">
                        <h1 className="hero-reveal font-heading font-extrabold text-4xl sm:text-6xl md:text-8xl tracking-tighter leading-[0.9] text-text-primary text-balance">
                            {headlineLine1}
                        </h1>
                        <h1 className="hero-reveal font-serifItalic italic font-light text-[3.8rem] sm:text-[5.5rem] md:text-[9.5rem] leading-[0.75] gold-text tracking-tight pb-3">
                            {headlineLine2}
                        </h1>
                    </div>

                    {/* One Sentence Subtext */}
                    <p className="hero-reveal text-sm sm:text-base md:text-lg text-text-secondary font-heading max-w-xl leading-relaxed pt-2">
                        {subtext}
                    </p>

                    {/* Action Buttons */}
                    <div className="hero-reveal flex flex-wrap items-center gap-4 pt-6">
                        <MagneticButton>
                            <Link
                                href="/sign-up"
                                className="group relative overflow-hidden inline-flex items-center gap-2.5 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold text-sm px-8 py-4 rounded-full transition-transform duration-300 shadow-lg shadow-accent-gold/5"
                            >
                                <span className="relative z-10">Become a Member</span>
                                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </MagneticButton>

                        <MagneticButton>
                            <a
                                href="#legacy"
                                className="inline-flex items-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 text-text-primary font-medium text-sm px-8 py-4 rounded-full transition-colors"
                            >
                                Explore Legacy
                            </a>
                        </MagneticButton>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="hero-scroll-indicator absolute bottom-12 right-12 z-20 hidden md:flex flex-col items-center gap-3 opacity-30">
                <span className="font-mono text-[9px] text-text-secondary uppercase tracking-[0.3em]">Scroll</span>
                <div className="w-px h-16 bg-gradient-to-b from-accent-gold to-transparent" />
            </div>
        </section>
    );
};
