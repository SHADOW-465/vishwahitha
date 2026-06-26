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

// Full width impact statistics section with Dot-generated Rotary Gear
export const ImpactStatsSection = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Math Dot-Gear Simulation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let frameId: number;
        const size = 160;
        canvas.width = size;
        canvas.height = size;
        const cx = size / 2;
        const cy = size / 2;

        let rotation = 0;

        interface Dot {
            angle: number;
            radius: number;
            baseRadius: number;
            type: "outer" | "inner" | "spoke" | "tooth";
            spokeIdx?: number;
        }

        const dots: Dot[] = [];

        // 1. Inner hub dots (16 dots)
        const innerCount = 16;
        for (let i = 0; i < innerCount; i++) {
            dots.push({
                angle: (Math.PI * 2 / innerCount) * i,
                radius: 20,
                baseRadius: 20,
                type: "inner"
            });
        }

        // 2. Outer rim dots (36 dots)
        const outerCount = 36;
        for (let i = 0; i < outerCount; i++) {
            dots.push({
                angle: (Math.PI * 2 / outerCount) * i,
                radius: 54,
                baseRadius: 54,
                type: "outer"
            });
        }

        // 3. Teeth dots (24 teeth, 2 dots per tooth)
        const teeth = 24;
        for (let i = 0; i < teeth; i++) {
            const angle = (Math.PI * 2 / teeth) * i;
            dots.push({
                angle: angle - 0.05,
                radius: 60,
                baseRadius: 60,
                type: "tooth"
            });
            dots.push({
                angle: angle + 0.05,
                radius: 60,
                baseRadius: 60,
                type: "tooth"
            });
        }

        // 4. Spokes dots (6 spokes, 5 dots per spoke)
        const spokes = 6;
        for (let i = 0; i < spokes; i++) {
            const angle = (Math.PI * 2 / spokes) * i;
            for (let j = 1; j <= 5; j++) {
                dots.push({
                    angle: angle,
                    radius: 20 + j * 6,
                    baseRadius: 20 + j * 6,
                    type: "spoke",
                    spokeIdx: i
                });
            }
        }

        const draw = () => {
            ctx.clearRect(0, 0, size, size);
            rotation += 0.006;

            // Draw all dot vertices
            dots.forEach((dot) => {
                let currentAngle = dot.angle;
                if (dot.type !== "spoke" || dot.spokeIdx === undefined) {
                    currentAngle += rotation;
                } else {
                    currentAngle += rotation;
                }

                const x = cx + Math.cos(currentAngle) * dot.radius;
                const y = cy + Math.sin(currentAngle) * dot.radius;

                // Subtle breathing size
                const pulse = Math.sin(rotation * 3 + dot.radius) * 0.4 + 1.2;

                ctx.beginPath();
                ctx.arc(x, y, pulse, 0, Math.PI * 2);
                ctx.fillStyle = "#D4AF37"; // Rotaract Gold
                ctx.shadowBlur = 6;
                ctx.shadowColor = "#D4AF37";
                ctx.fill();
            });

            frameId = requestAnimationFrame(draw);
        };

        draw();

        return () => cancelAnimationFrame(frameId);
    }, []);

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
            <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-16 space-y-6">
                
                {/* Dot Rotary Gear Canvas */}
                <div className="relative flex items-center justify-center p-4 rounded-full border border-white/5 glass-panel bg-white/2">
                    <canvas ref={canvasRef} className="w-40 h-40" />
                    <div className="absolute w-6 h-6 rounded-full bg-accent-gold/20 blur-sm pointer-events-none" />
                </div>

                <div className="space-y-2">
                    <span className="font-mono text-xs text-accent-gold uppercase tracking-[0.3em]">Our Footprint</span>
                    <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-text-primary tracking-tight">
                        Making a <span className="font-drama italic font-light gold-text">Real Difference</span>
                    </h2>
                    <p className="font-mono text-sm text-text-secondary mt-2">
                        Every statistic is backed by hours of youth-led community planning, execution, and local devotion.
                    </p>
                </div>
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
