"use client";

import { motion } from "framer-motion";

const sponsors = [
    { name: "Global CSR Tech", id: 1 },
    { name: "Luxe Dynamics", id: 2 },
    { name: "Apex Solutions", id: 3 },
    { name: "Vanguard Partners", id: 4 },
    { name: "Ethos Group", id: 5 },
    { name: "Momentum Inc", id: 6 },
];

export const SponsorShowcase = () => {
    return (
        <section className="py-24 border-t border-white/5 overflow-hidden relative">
            {/* Gold accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent" />

            <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-text-secondary opacity-40 mb-2">
                    Propelled By
                </p>
                <p className="font-heading text-sm font-bold text-text-secondary/60 uppercase tracking-widest">
                    Our Corporate &amp; Community Partners
                </p>
            </div>

            {/* Scrolling ticker */}
            <div className="relative flex whitespace-nowrap overflow-hidden">
                <motion.div
                    className="flex gap-20 items-center min-w-max"
                    animate={{ x: [0, "-50%"] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 32,
                            ease: "linear",
                        },
                    }}
                >
                    {[...sponsors, ...sponsors, ...sponsors, ...sponsors].map((sponsor, idx) => (
                        <div
                            key={`${sponsor.id}-${idx}`}
                            className="flex items-center gap-6 group cursor-default select-none"
                        >
                            {/* Gold diamond separator */}
                            <span className="text-accent-gold/30 text-xs font-mono">◆</span>

                            <span className="font-heading font-black text-2xl md:text-3xl text-white/20 group-hover:text-transparent bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-gold group-hover:to-accent-gold-light transition-all duration-500">
                                {sponsor.name}
                            </span>
                        </div>
                    ))}
                </motion.div>

                {/* Gradient masks matching background */}
                <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[var(--bg)] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[var(--bg)] to-transparent z-10 pointer-events-none" />
            </div>

            {/* Bottom gold line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent" />
        </section>
    );
};
