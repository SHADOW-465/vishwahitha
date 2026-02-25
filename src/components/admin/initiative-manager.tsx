"use client";

import { useState } from "react";
import { CMSDrawer } from "./cms-drawer";
import { createInitiative, deleteInitiative } from "@/lib/server-actions";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Props { initiatives: any[] }

export const InitiativeManager = ({ initiatives: initial }: Props) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        await createInitiative(fd);
        setLoading(false);
        setDrawerOpen(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-heading text-2xl font-bold text-text-primary">Initiatives</h2>
                    <p className="font-mono text-xs text-text-secondary mt-1">{initial.length} total</p>
                </div>
                <button onClick={() => setDrawerOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold text-sm px-5 py-2.5 rounded-full hover:scale-[1.03] transition-transform">
                    <Plus size={16} /> New Initiative
                </button>
            </div>

            <div className="space-y-3">
                {initial.map((init) => (
                    <div key={init.id} className="glass-panel rounded-2xl p-5 flex items-center justify-between group">
                        <div>
                            <h4 className="font-heading font-bold text-text-primary">{init.title}</h4>
                            <p className="font-mono text-xs text-text-secondary">{init.category} · /{init.slug}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/initiatives/${init.slug}`} target="_blank" className="p-2 rounded-xl bg-white/5 text-text-secondary hover:text-text-primary transition-colors">
                                <ExternalLink size={14} />
                            </Link>
                            <button onClick={() => deleteInitiative(init.id)} className="p-2 rounded-xl bg-accent-red/10 text-accent-red hover:bg-accent-red/20 transition-colors">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <CMSDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="New Initiative">
                <form onSubmit={handleCreate} className="space-y-5">
                    {[
                        { name: "title", label: "Title", required: true },
                        { name: "category", label: "Category / Avenue", required: true },
                        { name: "impact_stat", label: "Impact Number (e.g. 320)" },
                        { name: "impact_label", label: "Impact Label (e.g. elders served)" },
                        { name: "hero_image_url", label: "Hero Image URL" },
                    ].map((f) => (
                        <div key={f.name}>
                            <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">{f.label}</label>
                            <input name={f.name} required={f.required} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold" />
                        </div>
                    ))}
                    <div>
                        <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">Short Description (shown on cards)</label>
                        <textarea name="short_description" rows={2} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold resize-none" />
                    </div>
                    <div>
                        <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">Full Description (detail page)</label>
                        <textarea name="full_description" rows={5} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold resize-none" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold rounded-full hover:scale-[1.02] transition-transform disabled:opacity-50">
                        {loading ? "Creating..." : "Create Initiative"}
                    </button>
                </form>
            </CMSDrawer>
        </div>
    );
};
