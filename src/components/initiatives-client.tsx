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

    const fallbackInitiatives: Initiative[] = [
        {
            id: "fb-1",
            slug: "vaagai",
            title: "Vaagai",
            category: "Community Service",
            short_description: "Ganesh Chaturthi celebrations in old age homes, so elderly residents share in the festival.",
            hero_image_url: "/Vaagai.jpeg"
        },
        {
            id: "fb-2",
            slug: "vannangal",
            title: "Vannangal",
            category: "Community Service",
            short_description: "Speakers bringing knowledge, skills and support to young people living in orphanages.",
            hero_image_url: "/Vannangal.jpeg"
        },
        {
            id: "fb-3",
            slug: "visil",
            title: "Visil",
            category: "Club Service",
            short_description: "Reviving classic school sports games to reignite the joy and camaraderie of childhood.",
            hero_image_url: "/visil.jpeg"
        },
        {
            id: "fb-4",
            slug: "vawez",
            title: "Vawez",
            category: "Community Service",
            short_description: "A cultural dance showcase raising funds to fit water-saving taps in schools.",
            hero_image_url: "/Vawez.jpeg"
        },
        {
            id: "fb-5",
            slug: "peace",
            title: "Peace",
            category: "International Service",
            short_description: "Rotaractors worldwide sharing the peace symbol — one collective image of solidarity.",
            hero_image_url: "/Peace.jpeg"
        },
        {
            id: "fb-3",
            slug: "wishfit",
            title: "WishFit",
            category: "Community Service",
            short_description: "A clothing drive that collected and distributed festival outfits to individuals in neighboring communities.",
            impact_stat: "20+",
            impact_label: "Individuals Supported",
            color_class: "border-accent-red/30",
            hero_image_url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800"
        },
        {
            id: "fb-4",
            slug: "gigup",
            title: "GigUp",
            category: "Professional Development",
            short_description: "A multi-day online workshop led by industry speakers covering freelancing, portfolio building, and client outreach.",
            impact_stat: "30",
            impact_label: "Participants Trained",
            color_class: "border-accent-teal/30",
            hero_image_url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800"
        },
        {
            id: "fb-5",
            slug: "healthy-smiles",
            title: "The Healthy Smiles",
            category: "Community Service",
            short_description: "Oral check-up and hygiene drive partnered with Tagore Medical College at Sai Baba Gurukulam.",
            impact_stat: "40",
            impact_label: "Children Impacted",
            color_class: "border-accent-gold/30",
            hero_image_url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800"
        },
        {
            id: "fb-6",
            slug: "inbox-management",
            title: "Inbox Management",
            category: "Professional Development",
            short_description: "Corporate readiness workshop training participants in professional email writing and digital etiquette.",
            impact_stat: "140",
            impact_label: "Students Certified",
            color_class: "border-accent-teal/30",
            hero_image_url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800"
        },
        {
            id: "fb-7",
            slug: "project-peace",
            title: "Project Peace",
            category: "International Service",
            short_description: "A digital campaign on International Peace Day promoting global unity through online selfie submissions.",
            impact_stat: "75+",
            impact_label: "Submissions",
            color_class: "border-accent-red/30",
            hero_image_url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800"
        },
        {
            id: "fb-8",
            slug: "affirm",
            title: "Affirm (Daily Motivation)",
            category: "Club Service",
            short_description: "A year-long positive mindset drive sharing daily motivational content across social channels.",
            impact_stat: "155+",
            impact_label: "Days Running",
            color_class: "border-accent-gold/30",
            hero_image_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800"
        },
        {
            id: "fb-9",
            slug: "kandupidi-kandupidi",
            title: "Kandupidi Kandupidi",
            category: "Club Service",
            short_description: "An interactive digital guessing game highlighting club leaders to boost internal member bonding.",
            impact_stat: "24h",
            impact_label: "Game Duration",
            color_class: "border-accent-teal/30",
            hero_image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800"
        }
    ];

    const displayInitiatives = initiatives && initiatives.length > 0 ? initiatives : fallbackInitiatives;

    const mappedInitiatives = displayInitiatives.map(i => ({
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
