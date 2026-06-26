"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, Sparkles } from "lucide-react";

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
            ref={sectionRef}
            className="py-32 px-6 w-full max-w-7xl mx-auto border-t border-white/5 bg-transparent"
        >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
                {/* Left Side: Editorial Typography & Narrative (7 cols) */}
                <div className="md:col-span-7 space-y-8">
                    <div className="story-reveal flex items-center gap-2">
                        <Sparkles size={12} className="text-accent-gold" />
                        <span className="font-mono text-xs text-accent-gold uppercase tracking-[0.2em] font-medium">
                            Who We Are
                        </span>
                    </div>

                    <h2 className="story-reveal text-4xl md:text-5xl font-heading font-extrabold text-text-primary tracking-tight leading-[1.05] text-balance">
                        Merging corporate precision with{" "}
                        <span className="font-drama italic font-light gold-text">deep community roots.</span>
                    </h2>

                    {/* Massive Display Quote in Serif Italic */}
                    <div className="story-reveal border-l-2 border-accent-gold/30 pl-6 py-2 my-8">
                        <blockquote className="font-serifItalic italic text-2xl md:text-3xl text-text-primary font-light leading-relaxed">
                            "We do not just execute service projects. We forge the capacity of young individuals to take absolute ownership of local change."
                        </blockquote>
                    </div>

                    <p className="story-reveal font-mono text-sm md:text-base text-text-secondary leading-relaxed max-w-xl">
                        Chartered in 1999 under Rotary International, the Rotaract Club of Vishwahita is a Chennai-based collective of young professionals, executives, and leaders. We reject standard NGO templates, treating our service initiatives with the same creative depth and operational rigor as modern product launches.
                    </p>

                    <div className="story-reveal flex items-center gap-1.5 font-mono text-[10px] text-text-secondary">
                        <Compass size={12} className="animate-spin-slow" />
                        <span>Rotary District 3234 • Charter ID 52890</span>
                    </div>
                </div>

                {/* Right Side: Immersive B&W Photography Block (5 cols) */}
                <div className="md:col-span-5 relative w-full h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden border border-white/10 group shadow-2xl">
                    {/* Glowing aura behind image container */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent z-10" />
                    
                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800"
                        alt="Vishwahita Leadership Planning Session"
                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:scale-102 group-hover:opacity-75 transition-all duration-700"
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
        </section>
    );
};
