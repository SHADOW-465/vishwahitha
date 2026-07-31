"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

interface Initiative {
    id: string;
    slug: string;
    title: string;
    category: string;
    short_description?: string;
    impact_stat?: string;
    impact_label?: string;
    color_class?: string;
    hero_image_url?: string;
}

export const InitiativeCard = ({ initiative, index }: { initiative: Initiative; index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
    };

    const handleMouseLeave = () => {
        if (cardRef.current) {
            cardRef.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
            viewport={{ once: true }}
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="transition-transform duration-200 ease-out"
                style={{ transformStyle: "preserve-3d" }}
            >
                <Link href={`/initiatives/${initiative.slug}`}>
                    <div className={`glass-panel rounded-3xl overflow-hidden border ${initiative.color_class || "border-white/10"} hover:border-accent-gold/30 transition-colors duration-500 group`}>
                        {/* Image */}
                        {initiative.hero_image_url ? (
                            <div className="w-full aspect-video overflow-hidden">
                                <img
                                    src={initiative.hero_image_url}
                                    alt={initiative.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        ) : (
                            <div className="w-full aspect-video bg-gradient-to-br from-accent-gold/10 to-transparent flex items-center justify-center">
                                <span className="font-drama italic text-4xl md:text-5xl gold-text opacity-30">{initiative.title[0]}</span>
                            </div>
                        )}

                        <div className="p-5 md:p-8">
                            <div className="flex justify-between items-start mb-4">
                                <span className="font-mono text-xs uppercase tracking-widest text-text-secondary bg-white/5 px-3 py-1 rounded-full">
                                    {initiative.category}
                                </span>
                                <ArrowUpRight size={18} className="text-text-secondary group-hover:text-accent-gold transition-colors" />
                            </div>
                            <h3 className="font-heading text-2xl font-bold text-text-primary mb-3">{initiative.title}</h3>
                            {initiative.short_description && (
                                <p className="font-mono text-sm text-text-secondary leading-relaxed line-clamp-3">{initiative.short_description}</p>
                            )}
                            {initiative.impact_stat && (
                                <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-2">
                                    <span className="font-heading text-2xl font-bold gold-text">{initiative.impact_stat}</span>
                                    <span className="font-mono text-xs text-text-secondary">{initiative.impact_label}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
            </div>
        </motion.div>
    );
};
