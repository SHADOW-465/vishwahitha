"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Megaphone, Zap, Calendar, Image, Users, FileText, BarChart2, Radio, Menu, X } from "lucide-react";

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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const activeItem = NAV_ITEMS.find((i) => i.id === active);

    return (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 min-h-[80vh]">
            {/* Mobile sidebar toggle */}
            <div className="md:hidden">
                <button
                    onClick={() => setSidebarOpen((o) => !o)}
                    className="flex items-center gap-3 w-full glass-panel rounded-2xl px-4 py-3 text-left font-mono text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                    {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
                    <span className="flex-1">{activeItem?.label ?? "Menu"}</span>
                    {activeItem && <activeItem.icon size={16} className="text-accent-gold" />}
                </button>

                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                            className="overflow-hidden"
                        >
                            <div className="pt-2 space-y-1">
                                {NAV_ITEMS.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => { setActive(item.id); setSidebarOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 font-mono text-sm ${active === item.id
                                                ? "bg-accent-gold/10 border border-accent-gold/20 text-accent-gold"
                                                : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                                            }`}
                                    >
                                        <item.icon size={16} />
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Desktop sidebar — always visible on md+ */}
            <aside className="hidden md:block w-56 flex-shrink-0 space-y-1">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 font-mono text-sm ${active === item.id
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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
                                    className="glass-panel rounded-2xl p-4 md:p-6"
                                >
                                    <p className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mb-2">{stat.label}</p>
                                    <p className={`font-heading text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</p>
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
