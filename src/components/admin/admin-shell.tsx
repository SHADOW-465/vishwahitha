"use client";

import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Megaphone, Zap, Calendar, Image, Users, FileText, BarChart2, Radio } from "lucide-react";

const NAV_ITEMS = [
    { label: "Overview", icon: LayoutDashboard, id: "overview" },
    { label: "Announcements", icon: Megaphone, id: "announcements" },
    { label: "Initiatives", icon: Zap, id: "initiatives" },
    { label: "Events", icon: Calendar, id: "events" },
    { label: "Gallery", icon: Image, id: "gallery" },
    { label: "Board Members", icon: Users, id: "board" },
    { label: "Page Sections", icon: FileText, id: "sections" },
    { label: "Pulse Forms", icon: BarChart2, id: "pulse" },
    { label: "Broadcast", icon: Radio, id: "broadcast" },
];

interface Props {
    panels: Record<string, ReactNode>;
    stats: { members: number; events: number; announcements: number; pulseResponses: number };
}

export const AdminShell = ({ panels, stats }: Props) => {
    const [active, setActive] = useState("overview");

    return (
        <div className="flex gap-8 min-h-[80vh]">
            {/* Sidebar */}
            <aside className="w-56 flex-shrink-0 space-y-1">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 font-mono text-sm ${
                            active === item.id
                                ? "bg-accent-gold/10 border border-accent-gold/20 text-accent-gold"
                                : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                        }`}
                    >
                        <item.icon size={16} />
                        {item.label}
                    </button>
                ))}
            </aside>

            {/* Content area */}
            <main className="flex-1 min-w-0">
                {active === "overview" && (
                    <div className="space-y-8">
                        <h2 className="font-heading text-3xl font-bold text-text-primary">Overview</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: "Members", value: stats.members, color: "text-accent-teal" },
                                { label: "Events", value: stats.events, color: "text-accent-gold" },
                                { label: "Announcements", value: stats.announcements, color: "text-accent-red" },
                                { label: "Pulse Responses", value: stats.pulseResponses, color: "gold-text" },
                            ].map((stat) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-panel rounded-2xl p-6"
                                >
                                    <p className="font-mono text-xs text-text-secondary uppercase tracking-widest mb-2">{stat.label}</p>
                                    <p className={`font-heading text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
                {Object.entries(panels).map(([id, panel]) => (
                    active === id ? <div key={id}>{panel}</div> : null
                ))}
            </main>
        </div>
    );
};
