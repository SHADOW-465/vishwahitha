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
                <div className="space-y-2 sm:space-y-3">
                    <h2 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-text-primary tracking-tight leading-[0.95] text-balance">
                        Ready to serve with us?
                    </h2>
                </div>

                <p className="text-sm md:text-base text-text-secondary max-w-xl mx-auto leading-relaxed">
                    Apply to join a club that runs real service in Chennai — students and young professionals welcome.
                </p>

                <div className="flex flex-wrap justify-center gap-3 pt-4">
                    <MagneticButton>
                        <Link
                            href="/#join"
                            className="group relative overflow-hidden inline-flex items-center gap-2.5 bg-accent-cranberry text-text-primary font-bold text-sm px-10 py-5 rounded-full transition-all duration-300 shadow-xl shadow-accent-cranberry/15 hover:shadow-accent-cranberry/25 whitespace-nowrap"
                        >
                            <span className="relative z-10">Apply to join</span>
                            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
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
