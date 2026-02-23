"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const projects = [
    { id: 1, title: "Vaagai", category: "Elder Care Initiative", color: "bg-white/5 border border-white/10" },
    { id: 2, title: "INDRU", category: "Daily Knowledge", color: "bg-primary border border-white/10" },
    { id: 3, title: "WishFit", category: "Festive Clothing Drive", color: "bg-accent-cranberry/10 border border-accent-cranberry/30" }
];

export const ProjectShuffler = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % projects.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-32 px-6 w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <h2 className="text-4xl md:text-6xl font-heading font-bold text-text-primary">
                        Curated <br /> <span className="font-drama italic text-accent-gold font-light text-5xl md:text-7xl">Artifacts</span>
                    </h2>
                    <p className="text-text-secondary font-mono text-lg max-w-md">
                        Interact with our active live projects. Our functional artifacts scale real-world community impact.
                    </p>
                </div>

                <div className="relative h-[400px] w-full flex items-center justify-center cursor-pointer" onClick={() => setCurrentIndex((prev) => (prev + 1) % projects.length)}>
                    <AnimatePresence mode="popLayout">
                        {projects.map((project, index) => {
                            // Calculate relative position (0 is front, 1 is middle, 2 is back)
                            const relIndex = (index - currentIndex + projects.length) % projects.length;

                            return (
                                <motion.div
                                    key={project.id}
                                    layoutId={`card-${project.id}`}
                                    initial={{ opacity: 0, scale: 0.8, y: 100 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1 - relIndex * 0.05,
                                        y: relIndex * -40,
                                        zIndex: projects.length - relIndex,
                                    }}
                                    exit={{ opacity: 0, scale: 0.8, y: 100 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className={`absolute w-full max-w-md aspect-[4/3] rounded-3xl p-8 flex flex-col justify-end backdrop-blur-3xl shadow-2xl ${project.color}`}
                                >
                                    <p className="font-mono text-xs tracking-widest uppercase mb-2 text-text-secondary">
                                        {project.category}
                                    </p>
                                    <h3 className="text-3xl font-heading font-bold text-text-primary">
                                        {project.title}
                                    </h3>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};
