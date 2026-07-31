"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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

export const InitiativeCard = ({
    initiative,
}: {
    initiative: Initiative;
    index?: number;
}) => {
    return (
        <Link href={`/initiatives/${initiative.slug}`} className="group block h-full">
            <div
                className={`h-full rounded-2xl overflow-hidden border border-white/8 bg-white/[0.03] hover:border-accent-gold/30 transition-colors duration-300 ${
                    initiative.color_class || ""
                }`}
            >
                {initiative.hero_image_url ? (
                    <div className="w-full aspect-video overflow-hidden bg-black/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={initiative.hero_image_url}
                            alt=""
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                        />
                    </div>
                ) : (
                    <div className="w-full aspect-video bg-gradient-to-br from-accent-gold/10 via-primary to-accent-cranberry/5 flex items-center justify-center">
                        <span className="font-heading text-3xl font-extrabold text-accent-gold/40">
                            {initiative.title[0]}
                        </span>
                    </div>
                )}

                <div className="p-5 md:p-6">
                    <div className="flex justify-between items-start gap-3 mb-3">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                            {initiative.category}
                        </span>
                        <ArrowUpRight
                            size={16}
                            className="text-text-secondary group-hover:text-accent-gold transition-colors shrink-0"
                        />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-text-primary mb-2">
                        {initiative.title}
                    </h3>
                    {initiative.short_description && (
                        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                            {initiative.short_description}
                        </p>
                    )}
                    {initiative.impact_stat && (
                        <div className="mt-5 pt-4 border-t border-white/5 flex items-baseline gap-2">
                            <span className="font-heading text-xl font-bold text-accent-gold">
                                {initiative.impact_stat}
                            </span>
                            <span className="font-mono text-[10px] text-text-secondary uppercase tracking-wider">
                                {initiative.impact_label}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};
