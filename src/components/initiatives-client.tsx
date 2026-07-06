"use client";

import { useState } from "react";
import { InitiativeCard } from "@/components/initiative-card";

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

const CATEGORY_MAP: Record<string, string> = {
    "elderly care": "Community Service",
    "elderly companionship": "Community Service",
    "daily knowledge": "Professional Development",
    "community relief": "International Service",
    "crisis relief": "International Service",
    "club service": "Club Service",
    "international service": "International Service",
    "professional development": "Professional Development",
};

const mapCategory = (cat: string) => {
    const normalized = cat.toLowerCase().trim();
    return CATEGORY_MAP[normalized] || cat;
};

export const InitiativesClient = ({ initiatives }: { initiatives: Initiative[] }) => {
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Standard Rotaract Avenues of Service
    const categories = ["All", "Community Service", "Professional Development", "Club Service", "International Service"];

    const mappedInitiatives = initiatives.map(i => ({
        ...i,
        mappedCategory: mapCategory(i.category)
    }));

    const filtered = selectedCategory === "All"
        ? mappedInitiatives
        : mappedInitiatives.filter(i => i.mappedCategory.toLowerCase() === selectedCategory.toLowerCase());

    return (
        <div>
            {/* Category filter */}
            <div className="flex flex-wrap gap-3 mb-12">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`font-mono text-xs uppercase tracking-widest px-5 py-2.5 rounded-full border transition-all duration-300 ${
                            selectedCategory === cat
                                ? "border-accent-cranberry text-accent-cranberry bg-accent-cranberry/10"
                                : "border-white/10 text-text-secondary hover:border-white/30 hover:text-text-primary"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((initiative, i) => (
                        <InitiativeCard key={initiative.id} initiative={{ ...initiative, category: initiative.mappedCategory }} index={i} />
                    ))}
                </div>
            ) : (
                <div className="py-24 text-center text-text-secondary font-mono text-sm glass-panel rounded-[2rem] border border-white/5">
                    No active initiatives in this Avenue yet.
                </div>
            )}
        </div>
    );
};
