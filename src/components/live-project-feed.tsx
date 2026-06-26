"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Calendar, Tag } from "lucide-react";

interface Project {
    id: string;
    slug: string;
    title: string;
    category: string;
    short_description?: string;
    created_at?: string;
    hero_image_url?: string;
}

interface ProjectFeedProps {
    projects: Project[];
}

export const LiveProjectFeed = ({ projects }: ProjectFeedProps) => {
    const sectionRef = useRef<HTMLDivElement>(null);

    // Register ScrollTrigger
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        const ctx = gsap.context(() => {
            gsap.from(".feed-item", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                y: 60,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: "power3.out"
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Fallback projects if DB is empty
    const displayProjects = projects && projects.length > 0 ? projects.slice(0, 3) : [
        {
            id: "1",
            slug: "vaagai",
            title: "Vaagai Elder Care Companionship",
            category: "Elderly Care",
            short_description: "An ongoing companionship initiative connecting youth with regional old age homes for recreational games, tech training, and story archiving.",
            created_at: new Date().toISOString(),
            hero_image_url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=600"
        },
        {
            id: "2",
            slug: "indru",
            title: "INDRU Daily Learning Movement",
            category: "Daily Knowledge",
            short_description: "Providing continuous bite-sized cognitive insights in historical philosophy, technology, and global policy for Chennai students.",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            hero_image_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600"
        },
        {
            id: "3",
            slug: "wishfit",
            title: "WishFit Winter Garment Drive",
            category: "Community Relief",
            short_description: "A major district-wide donation operation collecting, sorting, and delivering quality clothing items to shelter networks.",
            created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
            hero_image_url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600"
        }
    ];

    return (
        <section ref={sectionRef} className="py-24 px-6 w-full max-w-5xl mx-auto border-t border-white/5">
            <div className="mb-16">
                <span className="font-mono text-xs text-accent-gold uppercase tracking-[0.3em]">Operational Flow</span>
                <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-text-primary tracking-tight mt-2">
                    Live Project <span className="font-drama italic font-light gold-text">Feed</span>
                </h2>
                <p className="font-mono text-sm text-text-secondary mt-3 max-w-md">
                    Recent initiatives synced directly with our Board Command database. Updates appear instantly.
                </p>
            </div>

            {/* Project List Feed */}
            <div className="space-y-6">
                {displayProjects.map((project) => (
                    <div
                        key={project.id}
                        className="feed-item group flex flex-col md:flex-row items-stretch justify-between gap-6 p-6 rounded-3xl glass-panel border border-white/5 hover:border-accent-gold/20 hover:bg-white/2 transition-all duration-300"
                    >
                        {/* Image preview box */}
                        <div className="relative w-full md:w-48 h-36 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                            <img
                                src={project.hero_image_url || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400"}
                                alt={project.title}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                        </div>

                        {/* Text info block */}
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                                <div className="flex flex-wrap items-center gap-3 text-text-secondary font-mono text-[10px] uppercase tracking-wider">
                                    <span className="flex items-center gap-1">
                                        <Tag size={10} className="text-accent-gold" /> {project.category}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={10} /> {new Date(project.created_at || "").toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-heading font-extrabold text-text-primary mt-2 group-hover:text-accent-gold transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-sm font-mono text-text-secondary mt-2 line-clamp-2">
                                    {project.short_description}
                                </p>
                            </div>

                            <div className="mt-4 md:mt-0">
                                <Link
                                    href={`/initiatives/${project.slug}`}
                                    className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-gold group-hover:translate-x-1.5 transition-transform"
                                >
                                    View Initiative Dossier <ArrowRight size={12} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
