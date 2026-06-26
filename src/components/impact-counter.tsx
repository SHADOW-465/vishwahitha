"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate, motion } from "framer-motion";
import { Award, Heart, CheckCircle2, MapPin } from "lucide-react";

interface CounterItemProps {
    value: string;
    label: string;
    icon?: React.ReactNode;
}

// Single animated counter card
export const ImpactCounter = ({ value, label, icon }: CounterItemProps) => {
    const ref = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-50px" });
    const [exploded, setExploded] = useState(false);

    // Extract numbers and suffixes safely
    const cleanValue = value || "0";
    const numericValue = parseInt(cleanValue.replace(/\D/g, ""), 10);
    const suffix = cleanValue.replace(/[0-9]/g, "");

    useEffect(() => {
        if (!isInView || !ref.current || isNaN(numericValue)) {
            if (ref.current) ref.current.textContent = cleanValue;
            return;
        }

        const node = ref.current;
        const controls = animate(0, numericValue, {
            duration: 2.2,
            ease: [0.25, 1, 0.5, 1],
            onUpdate(val) {
                node.textContent = Math.round(val).toLocaleString() + suffix;
            },
            onComplete() {
                setExploded(true);
            }
        });

        return () => controls.stop();
    }, [isInView, numericValue, suffix, cleanValue]);

    return (
        <div
            ref={containerRef}
            className="relative overflow-hidden glass-panel rounded-[2rem] p-8 flex flex-col items-center justify-between text-center min-h-[220px] w-full max-w-sm group transition-all duration-500 hover:border-accent-gold/40 hover:shadow-2xl hover:shadow-accent-gold/5"
        >
            {/* Sparkles / Exploding particles around card */}
            {exploded && (
                <div className="absolute inset-0 pointer-events-none z-0">
                    <motion.div 
                        initial={{ opacity: 0.8, scale: 0.8 }}
                        animate={{ opacity: 0, scale: 1.3 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 border border-accent-gold/30 rounded-[2rem]"
                    />
                    {Array.from({ length: 12 }).map((_, i) => {
                        const angle = (Math.PI * 2 / 12) * i;
                        const distance = 80 + Math.random() * 40;
                        return (
                            <motion.div
                                key={i}
                                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                                animate={{ 
                                    x: Math.cos(angle) * distance, 
                                    y: Math.sin(angle) * distance, 
                                    scale: 0,
                                    opacity: 0 
                                }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-accent-gold"
                            />
                        );
                    })}
                </div>
            )}

            {/* Glowing spot */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-accent-gold/5 blur-2xl rounded-full group-hover:bg-accent-gold/15 transition-colors" />

            {icon && (
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
            )}

            <div className="mt-6 flex-1 flex flex-col justify-center">
                <span 
                    ref={ref} 
                    className="block font-heading text-4xl sm:text-5xl font-extrabold gold-text tracking-tighter"
                >
                    0{suffix}
                </span>
                <span className="block font-mono text-xs text-text-secondary uppercase tracking-[0.2em] mt-3">
                    {label}
                </span>
            </div>
        </div>
    );
};

// Full width impact statistics section
export const ImpactStatsSection = () => {
    const stats = [
        {
            value: "27",
            label: "Years of Legacy",
            icon: <Award size={20} className="text-accent-gold" />
        },
        {
            value: "500+",
            label: "Projects Completed",
            icon: <CheckCircle2 size={20} className="text-accent-teal" />
        },
        {
            value: "2000+",
            label: "Lives Touched",
            icon: <Heart size={20} className="text-accent-red" />
        },
        {
            value: "3234",
            label: "Rotaract District",
            icon: <MapPin size={20} className="text-accent-gold" />
        }
    ];

    return (
        <section className="py-24 px-6 w-full max-w-7xl mx-auto border-t border-white/5">
            <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
                <span className="font-mono text-xs text-accent-gold uppercase tracking-[0.3em]">Our Footprint</span>
                <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-text-primary tracking-tight">
                    Making a <span className="font-drama italic font-light gold-text">Real Difference</span>
                </h2>
                <p className="font-mono text-sm text-text-secondary">
                    Every statistic is backed by hours of youth-led community planning, execution, and local devotion.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <ImpactCounter
                        key={index}
                        value={stat.value}
                        label={stat.label}
                        icon={stat.icon}
                    />
                ))}
            </div>
        </section>
    );
};
