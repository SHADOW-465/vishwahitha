"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
    { id: "hero", label: "Intro" },
    { id: "pulse", label: "Live Pulse" },
    { id: "legacy", label: "Our Legacy" },
    { id: "about", label: "Who We Are" },
    { id: "initiatives", label: "Bento Archive" },
    { id: "events", label: "Engagements" },
    { id: "impact", label: "Impact Stats" },
    { id: "join", label: "Join Us" }
];

export const StoryNavigator = () => {
    const [activeSection, setActiveSection] = useState("hero");
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-40% 0px -40% 0px", // Trigger when the section occupies the center of the viewport
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach((sec) => {
            const el = document.getElementById(sec.id);
            if (el) observer.observe(el);
        });

        return () => {
            sections.forEach((sec) => {
                const el = document.getElementById(sec.id);
                if (el) observer.unobserve(el);
            });
        };
    }, []);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div 
            className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-5 items-center bg-black/25 backdrop-blur-md border border-white/5 rounded-full px-3 py-6 shadow-2xl"
            style={{ mixBlendMode: "difference" }}
        >
            {/* Visual connecting timeline track */}
            <div className="absolute top-8 bottom-8 w-px bg-white/10 z-0" />

            {sections.map((sec, idx) => {
                const isActive = sec.id === activeSection;
                const isHovered = hoveredIdx === idx;

                return (
                    <button
                        key={sec.id}
                        onClick={() => scrollTo(sec.id)}
                        onMouseEnter={() => setHoveredIdx(idx)}
                        onMouseLeave={() => setHoveredIdx(null)}
                        className="relative z-10 flex items-center justify-center w-6 h-6 focus:outline-none group"
                        aria-label={`Scroll to ${sec.label}`}
                    >
                        {/* Interactive Node Dot */}
                        <motion.div
                            className={`rounded-full border transition-all duration-300 ${
                                isActive
                                    ? "w-3 h-3 bg-accent-cranberry border-accent-cranberry shadow-lg shadow-accent-cranberry/40"
                                    : "w-2.5 h-2.5 bg-white/20 border-transparent hover:bg-white/60 hover:scale-125"
                            }`}
                            animate={{
                                scale: isActive ? 1.2 : 1,
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />

                        {/* Floating Section Label on Hover or Active */}
                        <AnimatePresence>
                            {(isHovered || (isActive && hoveredIdx === null)) && (
                                <motion.span
                                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: -16, scale: 1 }}
                                    exit={{ opacity: 0, x: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="absolute right-6 font-mono text-[9px] font-bold text-text-primary bg-black/80 backdrop-blur-xl border border-white/10 rounded-md px-2 py-1 uppercase tracking-widest whitespace-nowrap shadow-xl pointer-events-none"
                                >
                                    {sec.label}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                );
            })}
        </div>
    );
};
