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
        <section className="py-20 border-t border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-text-secondary opacity-50">
                    Propelled by our <span className="text-text-primary">Corporate & Community Partners</span>
                </p>
            </div>

            <div className="relative flex whitespace-nowrap overflow-hidden">
                <motion.div
                    className="flex gap-20 items-center justify-around min-w-full"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 30,
                            ease: "linear",
                        },
                    }}
                >
                    {[...sponsors, ...sponsors].map((sponsor, idx) => (
                        <div
                            key={`${sponsor.id}-${idx}`}
                            className="text-2xl md:text-3xl font-heading font-black text-white/20 hover:text-white/40 grayscale transition-all duration-500 cursor-default select-none"
                        >
                            {sponsor.name}
                        </div>
                    ))}
                </motion.div>

                {/* Gradient Masks */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-primary to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-primary to-transparent z-10" />
            </div>
        </section>
    );
};
