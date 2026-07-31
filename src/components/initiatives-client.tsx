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
    community: "Community Service",
    professional: "Professional Development",
    international: "International Service",
    club: "Club Service",
};

const mapCategory = (cat: string) => {
    const normalized = cat.toLowerCase().trim();
    return CATEGORY_MAP[normalized] || cat;
};

/** No stock Unsplash. If CMS is empty, show an honest empty state. */
export const InitiativesClient = ({ initiatives }: { initiatives: Initiative[] }) => {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = [
        "All",
        "Community Service",
        "Professional Development",
        "Club Service",
        "International Service",
    ];

    if (!initiatives?.length) {
        return (
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-10 text-center text-sm text-text-secondary">
                No featured projects yet. The president can publish them under Admin → Initiatives.
            </div>
        );
    }

    const mappedInitiatives = initiatives.map((i) => ({
        ...i,
        mappedCategory: mapCategory(i.category),
        hero_image_url: i.hero_image_url || undefined,
    }));

    const filtered =
        selectedCategory === "All"
            ? mappedInitiatives
            : mappedInitiatives.filter(
                  (i) => i.mappedCategory.toLowerCase() === selectedCategory.toLowerCase()
              );

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-10">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-full px-4 py-2 font-mono text-xs border transition-colors ${
                            selectedCategory === cat
                                ? "border-accent-gold/40 bg-accent-gold/10 text-accent-gold"
                                : "border-white/10 text-text-secondary hover:text-text-primary"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <p className="text-sm text-text-secondary font-mono">
                    No projects in this avenue yet.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((init) => (
                        <InitiativeCard key={init.id || init.slug} initiative={init} />
                    ))}
                </div>
            )}
        </div>
    );
};
