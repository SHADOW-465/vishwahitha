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
                    <p className="story-reveal font-mono text-xs text-accent-gold uppercase tracking-[0.2em] font-medium">
                        Who we are
                    </p>

                    <h2 className="story-reveal text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-text-primary tracking-tight leading-[1.05] text-balance">
                        Universal friendship with{" "}
                        <span className="font-display-drama gold-text">deep roots in Chennai.</span>
                    </h2>

                    <div className="story-reveal border-l-2 border-accent-gold/30 pl-6 py-2 my-8">
                        <blockquote className="font-display-drama text-xl sm:text-2xl md:text-3xl text-text-primary leading-relaxed">
                            We do not only run projects. We build young people who take ownership of local change.
                        </blockquote>
                    </div>

                    <p className="story-reveal font-mono text-sm md:text-base text-text-secondary leading-relaxed max-w-xl">
                        Chartered on March 10, 1999, and sponsored by the Rotary Club of Madras Industrial City, the Rotaract Club of Vishwahita is a Chennai-based collective of young leaders. In Sanskrit, "Vishwahita" translates to "universal friendship" — the foundational working principle behind our 500+ projects and collaborative committee structure.
                    </p>

                    <div className="story-reveal flex items-center gap-1.5 font-mono text-[10px] text-text-secondary">
                        <Compass size={12} className="text-accent-gold shrink-0" />
                        <span>Rotary District 3234 · Sponsored by Rotary Club of Madras Industrial City</span>
                    </div>
                </div>

                {/* Right Side: Immersive B&W Photography Block (5 cols) */}
                <div className="md:col-span-5 relative w-full h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden border border-white/10 group shadow-2xl">
                    {/* Glowing aura behind image container */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent z-10" />
                    
                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800"
                        alt="Vishwahita Leadership Planning Session"
                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:opacity-75 transition-all duration-700"
                    />

                    {/* Floating caption on hover */}
                    <div className="absolute bottom-8 left-8 right-8 z-20 transform translate-y-3 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="font-mono text-[10px] uppercase text-accent-gold tracking-widest font-semibold">
                             Vishwahita Board Command
                        </p>
                        <p className="font-heading text-xs text-text-primary mt-1">
                            Interactive brainstorming at the annual youth leadership summit, Chennai.
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
