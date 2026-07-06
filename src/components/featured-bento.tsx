"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Heart, BookOpen, Shirt, Image as ImageIcon } from "lucide-react";

interface BentoCardProps {
    title: string;
    category: string;
    description: string;
    impact: string;
    impactLabel: string;
    icon: React.ReactNode;
    image: string;
    slug: string;
    className?: string;
    colorTheme: string; // "gold" | "teal" | "red"
}

const BentoCard = ({
    title,
    category,
    description,
    impact,
    impactLabel,
    icon,
    image,
    slug,
    className = "",
    colorTheme,
}: BentoCardProps) => {
    const themeClasses = {
        gold: {
            border: "hover:border-accent-gold/40",
            glow: "group-hover:bg-accent-gold/10",
            text: "text-accent-gold",
            gradient: "from-accent-gold/20 to-transparent",
        },
        teal: {
            border: "hover:border-accent-teal/40",
            glow: "group-hover:bg-accent-teal/10",
            text: "text-accent-teal",
            gradient: "from-accent-teal/20 to-transparent",
        },
        red: {
            border: "hover:border-accent-red/40",
            glow: "group-hover:bg-accent-red/10",
            text: "text-accent-red",
            gradient: "from-accent-red/20 to-transparent",
        },
    }[colorTheme as "gold" | "teal" | "red"];

    return (
        <Link href={`/initiatives/${slug}`} className={`group relative block overflow-hidden rounded-[2rem] glass-panel border border-white/5 transition-all duration-500 hover:shadow-2xl ${themeClasses.border} ${className}`}>
            {/* Background image zoom on hover */}
            <div className="absolute inset-0 z-0">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover grayscale opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${themeClasses.gradient} opacity-40`} />
            </div>

            {/* Content overlay */}
            <div className="relative z-10 h-full w-full p-8 flex flex-col justify-between min-h-[260px]">
                <div className="flex items-start justify-between">
                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                            {category}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-text-primary mt-1 group-hover:text-accent-gold transition-colors">
                            {title}
                        </h3>
                    </div>
                    <div className={`p-3 bg-white/5 rounded-2xl border border-white/5 ${themeClasses.glow} transition-colors`}>
                        {icon}
                    </div>
                </div>

                <div>
                    <p className="font-mono text-xs text-text-secondary max-w-md leading-relaxed mb-6 group-hover:text-text-primary transition-colors">
                        {description}
                    </p>

                    <div className="flex items-end justify-between">
                        <div>
                            <span className="block font-heading font-extrabold text-2xl sm:text-3xl gold-text">
                                {impact}
                            </span>
                            <span className="block font-mono text-[9px] uppercase tracking-wider text-text-secondary mt-1">
                                {impactLabel}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-xs text-text-primary border border-white/10 rounded-full px-4 py-2 bg-black/40 group-hover:bg-accent-gold group-hover:text-primary transition-colors duration-300">
                            Explore <ArrowUpRight size={12} />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export const FeaturedBento = () => {
    return (
        <section className="py-24 px-6 w-full max-w-7xl mx-auto border-t border-white/5">
            <div className="mb-12">
                <span className="font-mono text-xs text-accent-gold uppercase tracking-[0.3em]">Featured Actions</span>
                <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-text-primary tracking-tight mt-2">
                    Curated <span className="font-drama italic font-light gold-text">Bento Archive</span>
                </h2>
                <p className="font-mono text-sm text-text-secondary mt-3 max-w-md">
                    Our three pillars of community action. Click on any block to dive into their full execution scope.
                </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Large Card (Vaagai) */}
                <BentoCard
                    title="Vaagai Elder Care"
                    category="Community Service"
                    description="Connecting youth with elder care homes through companion programs, story journaling, and interactive board game sessions."
                    impact="320+"
                    impactLabel="Elders Comforted"
                    icon={<Heart size={18} className="text-accent-gold" />}
                    image="https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=800"
                    slug="vaagai"
                    colorTheme="gold"
                    className="md:col-span-2"
                />

                {/* Card 2: Tall Card (INDRU) */}
                <BentoCard
                    title="INDRU Platform"
                    category="Professional Development"
                    description="Our signature learning movement sharing daily insights in philosophy, science, and history to make members continuous learners."
                    impact="365"
                    impactLabel="Insights Shared"
                    icon={<BookOpen size={18} className="text-accent-teal" />}
                    image="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800"
                    slug="indru"
                    colorTheme="teal"
                    className="md:row-span-2 h-full"
                />

                {/* Card 3: Small Card (WishFit) */}
                <BentoCard
                    title="WishFit Campaign"
                    category="International Service"
                    description="A seasonal clothing and support drive ensuring underprivileged communities receive warm festive garments."
                    impact="1,200+"
                    impactLabel="Garments Donated"
                    icon={<Shirt size={18} className="text-accent-red" />}
                    image="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800"
                    slug="wishfit"
                    colorTheme="red"
                />

                {/* Card 4: Interactive Gallery/CTA Block */}
                <div className="relative group overflow-hidden rounded-[2rem] glass-panel border border-white/5 p-8 flex flex-col justify-between min-h-[260px] md:col-span-2 bg-gradient-to-br from-white/2 to-transparent">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800"
                            alt="Gallery preview"
                            className="w-full h-full object-cover opacity-10 group-hover:opacity-20 group-hover:scale-105 transition-all duration-700 grayscale"
                        />
                    </div>
                    <div className="relative z-10 flex items-start justify-between">
                        <div>
                            <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">Club Service & Fellowship</span>
                            <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-text-primary mt-1">Cinematic Gallery</h3>
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-accent-gold">
                            <ImageIcon size={18} />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="font-mono text-xs text-text-secondary max-w-lg leading-relaxed mb-6">
                            A live photographic display of our district initiatives, board planning, and outdoor service rallies.
                        </p>
                        <Link href="/gallery" className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-gold border border-accent-gold/20 hover:border-accent-gold/50 bg-accent-gold/5 rounded-full px-5 py-2.5 transition-colors duration-300">
                            Open Gallery
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
