"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "./ui/magnetic-button";

export const JoinMission = () => {
    return (
        <section
            id="join"
            className="relative py-28 md:py-32 px-6 w-full max-w-7xl mx-auto overflow-hidden border-t border-white/5 bg-primary text-center"
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-accent-gold/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-8 min-w-0">
                <p className="font-mono text-[10px] text-accent-gold uppercase tracking-[0.22em] font-medium">
                    Membership · Students & young professionals
                </p>

                <div className="space-y-3">
                    <h2 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-text-primary tracking-tighter leading-[0.98] text-balance">
                        The next chapter needs you in the room
                    </h2>
                    <p className="font-drama font-light text-2xl sm:text-3xl md:text-4xl leading-snug gold-text tracking-tight">
                        Unite for Good. Rise Above.
                    </p>
                </div>

                <p className="font-mono text-sm md:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
                    Join a 27-year club that runs real service, meets in Chennai, and builds leaders who take ownership — not spectators.
                </p>

                <div className="flex flex-wrap justify-center gap-3 pt-4">
                    <MagneticButton>
                        <Link
                            href="/sign-up"
                            className="group relative overflow-hidden inline-flex items-center gap-2.5 bg-gradient-to-r from-accent-cranberry to-accent-gold text-text-primary font-bold text-sm px-10 py-5 rounded-full transition-all duration-300 shadow-xl shadow-accent-cranberry/15 hover:shadow-accent-cranberry/25 whitespace-nowrap"
                        >
                            <span className="relative z-10">Become a member</span>
                            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            <span className="absolute inset-0 z-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </Link>
                    </MagneticButton>
                    <Link
                        href="/about"
                        className="inline-flex items-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 text-text-primary font-medium text-sm px-8 py-5 rounded-full transition-colors whitespace-nowrap"
                    >
                        Meet the club
                    </Link>
                </div>

                <p className="font-mono text-[10px] text-text-secondary/80 pt-2 leading-relaxed">
                    Sponsored by the Rotary Club of Madras Industrial City · District 3234
                </p>
            </div>
        </section>
    );
};
