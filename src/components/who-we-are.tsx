"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass } from "lucide-react";

export const WhoWeAre = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            gsap.from(".story-reveal", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                    toggleActions: "play none none none",
                },
                y: 50,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: "power3.out",
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="py-32 px-6 w-full max-w-7xl mx-auto border-t border-white/5 bg-transparent"
        >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
                {/* Left Side: Editorial Typography & Narrative (7 cols) */}
                <div className="md:col-span-7 space-y-8">
                    <h2 className="story-reveal text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-text-primary tracking-tight leading-[1.05] text-balance">
                        Universal friendship with deep roots in Chennai.
                    </h2>

                    <div className="story-reveal border border-white/10 rounded-2xl px-6 py-5 my-8 bg-white/[0.03]">
                        <blockquote className="text-lg sm:text-xl md:text-2xl text-text-primary leading-relaxed font-heading">
                            We do not only run projects. We build young people who take ownership of local change.
                        </blockquote>
                    </div>

                    <p className="story-reveal text-sm md:text-base text-text-secondary leading-relaxed max-w-xl">
                        Chartered on 10 March 1999 and sponsored by the Rotary Club of Madras Industrial City, the Rotaract Club of Vishwahita is a Chennai-based collective of young leaders. Vishwahita means universal friendship — the principle behind how we serve under RI District 3234.
                    </p>

                    <div className="story-reveal flex items-center gap-1.5 font-mono text-[10px] text-text-secondary">
                        <Compass size={12} className="text-accent-gold shrink-0" />
                        <span>Rotary District 3234 · Sponsored by Rotary Club of Madras Industrial City</span>
                    </div>
                </div>

                {/* Right Side: Immersive B&W Photography Block (5 cols) */}
                <div className="md:col-span-5 relative w-full h-[320px] md:h-[420px] rounded-[2rem] overflow-hidden border border-white/10 bg-gradient-to-br from-accent-gold/10 via-primary to-accent-cranberry/10 flex items-end p-8">
                    <div>
                        <p className="font-mono text-[10px] uppercase text-accent-gold tracking-wider">
                            RI District 3234 · Group 01
                        </p>
                        <p className="font-heading text-lg text-text-primary mt-2 font-semibold">
                            Chartered 1999 · Madras Industrial City
                        </p>
                    </div>
                </div>
            </div>

            {/* Principles Grid */}
            <div className="story-reveal mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Principle 1: Universal Friendship */}
                <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:border-accent-gold/20 transition-all duration-500 bg-black/10">
                    <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-accent-gold/5 blur-[40px] pointer-events-none" />
                    <h3 className="font-heading text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                        <span className="font-mono text-[9px] text-accent-gold bg-accent-gold/10 border border-accent-gold/20 px-2 py-0.5 rounded-md uppercase tracking-wider font-semibold">Principle</span>
                        Universal Friendship (Vishwahita)
                    </h3>
                    <p className="font-mono text-xs text-text-secondary leading-relaxed mb-6">
                        "Universal friendship" is the operational standard shaping our projects and committee structures, ensuring:
                    </p>
                    <ul className="space-y-3 font-mono text-xs text-text-secondary">
                        <li className="flex items-start gap-2">
                            <span className="text-accent-gold font-bold">•</span>
                            <span><strong>Who we serve:</strong> Projects designed for inclusion and true grassroots impact, not visibility.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-accent-gold font-bold">•</span>
                            <span><strong>How we work:</strong> Cross-functional collaboration across committees, rejecting isolated initiatives.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-accent-gold font-bold">•</span>
                            <span><strong>What we measure:</strong> Project completion rates and exact outreach figures over intentions.</span>
                        </li>
                    </ul>
                </div>

                {/* Principle 2: Continuity with Purpose */}
                <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:border-accent-teal/20 transition-all duration-500 bg-black/10">
                    <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-accent-teal/5 blur-[40px] pointer-events-none" />
                    <h3 className="font-heading text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                        <span className="font-mono text-[9px] text-accent-teal bg-accent-teal/10 border border-accent-teal/20 px-2 py-0.5 rounded-md uppercase tracking-wider font-semibold">Approach</span>
                        Continuity With Purpose
                    </h3>
                    <p className="font-mono text-xs text-text-secondary leading-relaxed mb-6">
                        We operate a structured, multi-generational organization where boards inherit and expand existing progress:
                    </p>
                    <ul className="space-y-3 font-mono text-xs text-text-secondary">
                        <li className="flex items-start gap-2">
                            <span className="text-accent-teal font-bold">•</span>
                            <span><strong>Inherited Progression:</strong> Each board builds directly on the previous board's projects, not from zero.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-accent-teal font-bold">•</span>
                            <span><strong>Innovation inside Frameworks:</strong> Every new committee integrates fresh ideas within our existing framework.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-accent-teal font-bold">•</span>
                            <span><strong>Track Record Addition:</strong> Every project adds to a 27-year track record rather than being a standalone event.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
};
