"use client";

import { motion } from "framer-motion";
import { Pin, Lock } from "lucide-react";

const TAG_COLORS: Record<string, string> = {
    event: "bg-accent-teal/10 text-accent-teal border-accent-teal/20",
    urgent: "bg-accent-red/10 text-accent-red border-accent-red/20",
    update: "bg-accent-gold/10 text-accent-gold border-accent-gold/20",
    general: "bg-white/5 text-text-secondary border-white/10",
};

interface Announcement {
    id: string;
    title: string;
    content: string;
    tag: string;
    visibility: string;
    is_pinned: boolean;
    created_at: string;
}

export const AnnouncementCard = ({ announcement: a, index }: { announcement: Announcement; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.07, ease: [0.25, 1, 0.5, 1] }}
            viewport={{ once: true }}
            className={`glass-panel rounded-3xl p-8 ${a.is_pinned ? "border-accent-gold/30" : ""}`}
        >
            <div className="flex items-start justify-between mb-4 gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <span className={`font-mono text-[10px] uppercase tracking-widest border rounded-full px-3 py-1 ${TAG_COLORS[a.tag] || TAG_COLORS.general}`}>
                        {a.tag}
                    </span>
                    {a.is_pinned && (
                        <span className="flex items-center gap-1 font-mono text-[10px] text-accent-gold">
                            <Pin size={10} /> Pinned
                        </span>
                    )}
                    {a.visibility === "members" && (
                        <span className="flex items-center gap-1 font-mono text-[10px] text-text-secondary">
                            <Lock size={10} /> Members Only
                        </span>
                    )}
                </div>
                <span className="font-mono text-[10px] text-text-secondary whitespace-nowrap">
                    {new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
            </div>
            <h3 className="font-heading text-xl font-bold text-text-primary mb-3">{a.title}</h3>
            <p className="font-mono text-sm text-text-secondary leading-relaxed">{a.content}</p>
        </motion.div>
    );
};
