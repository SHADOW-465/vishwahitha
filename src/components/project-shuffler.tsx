"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Initiative {
    id: string;
    slug: string;
    title: string;
    category: string;
    short_description?: string;
    impact_stat?: string;
    impact_label?: string;
    color_class?: string;
}

interface Props { initiatives: Initiative[] }

export const ProjectShuffler = ({ initiatives }: Props) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (initiatives.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % initiatives.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [initiatives.length]);

    if (initiatives.length === 0) return null;

    return (
        <section className="py-32 px-6 w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <h2 className="text-4xl md:text-6xl font-heading font-bold text-text-primary">
                        Curated <br />
                        <span className="font-drama italic gold-text font-light text-5xl md:text-7xl">Artifacts</span>
                    </h2>
                    <p className="text-text-secondary font-mono text-lg max-w-md">
                        Our active initiatives. Click any card to explore the full story.
                    </p>
                    {/* Dot indicators */}
                    <div className="flex gap-2">
                        {initiatives.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    i === currentIndex ? "w-8 bg-accent-gold" : "w-1.5 bg-white/20"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <div
                    className="relative h-[420px] w-full flex items-center justify-center cursor-pointer"
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % initiatives.length)}
                >
                    <AnimatePresence mode="popLayout">
                        {initiatives.map((initiative, index) => {
                            const relIndex = (index - currentIndex + initiatives.length) % initiatives.length;
                            if (relIndex >= 3) return null; // only show top 3

                            return (
                                <motion.div
                                    key={initiative.id}
                                    layoutId={`shuffler-card-${initiative.id}`}
                                    initial={{ opacity: 0, scale: 0.85, y: 80 }}
                                    animate={{
                                        opacity: relIndex === 0 ? 1 : 0.6 - relIndex * 0.15,
                                        scale: 1 - relIndex * 0.045,
                                        y: relIndex * -36,
                                        zIndex: initiatives.length - relIndex,
                                    }}
                                    exit={{ opacity: 0, scale: 0.8, y: 80 }}
                                    transition={{ type: "spring", stiffness: 220, damping: 22 }}
                                    className={`absolute w-full max-w-md aspect-[4/3] rounded-3xl p-8 flex flex-col justify-between glass-panel border ${initiative.color_class || "border-white/10"}`}
                                >
                                    <div>
                                        <p className="font-mono text-xs tracking-widest uppercase mb-2 text-text-secondary">
                                            {initiative.category}
                                        </p>
                                        <h3 className="text-3xl font-heading font-bold text-text-primary mb-3">
                                            {initiative.title}
                                        </h3>
                                        {initiative.short_description && (
                                            <p className="text-sm text-text-secondary font-mono leading-relaxed line-clamp-2">
                                                {initiative.short_description}
                                            </p>
                                        )}
                                    </div>
                                    {initiative.impact_stat && (
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-3xl font-heading font-bold gold-text">{initiative.impact_stat}</p>
                                                <p className="font-mono text-xs text-text-secondary">{initiative.impact_label}</p>
                                            </div>
                                            {relIndex === 0 && (
                                                <Link
                                                    href={`/initiatives/${initiative.slug}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex items-center gap-2 text-xs font-mono border border-white/20 rounded-full px-4 py-2 hover:bg-white/10 transition-colors text-text-primary"
                                                >
                                                    Explore <ArrowRight size={12} />
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};
