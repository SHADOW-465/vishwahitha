"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Trophy } from "lucide-react";
import { MagneticButton } from "./ui/magnetic-button";

export const JoinMission = () => {
    return (
        <section className="relative py-32 px-6 w-full max-w-7xl mx-auto overflow-hidden border-t border-white/5 bg-primary text-center">
            {/* Background glowing gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-accent-gold/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/25 rounded-full px-4 py-2">
                    <Trophy size={12} className="text-accent-gold animate-bounce" />
                    <span className="font-mono text-[10px] text-accent-gold uppercase tracking-[0.2em] font-medium">
                        Admissions Open
                    </span>
                </div>

                {/* Emotional Headline */}
                <div className="space-y-4">
                    <h2 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-7xl text-text-primary tracking-tighter leading-[0.95] text-balance">
                        The Next 27 Years
                    </h2>
                    <h2 className="font-drama italic font-light text-[3.5rem] sm:text-[4.5rem] md:text-[6.5rem] leading-[0.8] gold-text tracking-tight pb-2">
                        Need New Leaders.
                    </h2>
                </div>

                {/* Body narrative */}
                <p className="font-mono text-sm md:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
                    We don't just execute community projects. We build the executives, thinkers, and builders of tomorrow's Chennai. Your chapter starts today.
                </p>

                {/* Call-to-action button */}
                <div className="flex justify-center pt-6">
                    <MagneticButton>
                        <Link
                            href="/sign-up"
                            className="group relative overflow-hidden inline-flex items-center gap-2.5 bg-gradient-to-r from-accent-cranberry to-accent-gold text-text-primary font-bold text-sm px-10 py-5 rounded-full transition-all duration-300 shadow-xl shadow-accent-cranberry/15 hover:shadow-accent-cranberry/25"
                        >
                            <span className="relative z-10">Become a Member</span>
                            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            
                            {/* Inner ambient slide background on hover */}
                            <span className="absolute inset-0 z-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </Link>
                    </MagneticButton>
                </div>

                {/* Subtext info */}
                <div className="flex items-center justify-center gap-1.5 font-mono text-[10px] text-text-secondary/70 pt-4">
                    <Sparkles size={10} className="text-accent-gold" />
                    <span>Sponsored by Rotary International • District 3234</span>
                </div>
            </div>
        </section>
    );
};
