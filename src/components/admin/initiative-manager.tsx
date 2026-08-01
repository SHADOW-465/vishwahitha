"use client";

import { useState } from "react";
import { CMSDrawer } from "./cms-drawer";
import {
    createInitiative,
    deleteInitiative,
    setInitiativeLegacy,
    updateInitiative,
} from "@/lib/server-actions";
import { Plus, Trash2, ExternalLink, Star, Pencil } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Props {
    initiatives: any[];
}

export const InitiativeManager = ({ initiatives: initial }: Props) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editing, setEditing] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState(initial);

    async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        if (fd.get("is_featured_check")) fd.set("is_featured", "true");
        fd.set("is_signature", fd.get("is_signature_check") ? "true" : "false");
        const res = await createInitiative(fd);
        setLoading(false);
        if (res.success) {
            toast.success(res.message);
            setDrawerOpen(false);
            if (res.data) setItems((list) => [...list, res.data]);
        } else toast.error(res.message);
    }

    async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!editing) return;
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        if (fd.get("is_featured_check")) fd.set("is_featured", "true");
        else fd.set("is_featured", "false");
        fd.set("is_signature", fd.get("is_signature_check") ? "true" : "false");
        const res = await updateInitiative(editing.id, fd);
        setLoading(false);
        if (res.success) {
            toast.success(res.message);
            setEditing(null);
            if (res.data) {
                setItems((list) => list.map((i) => (i.id === editing.id ? res.data : i)));
            }
        } else toast.error(res.message);
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete initiative?")) return;
        const res = await deleteInitiative(id);
        if (res.success) {
            toast.success(res.message);
            setItems((list) => list.filter((i) => i.id !== id));
        } else toast.error(res.message);
    }

    async function handleLegacy(id: string) {
        const res = await setInitiativeLegacy(id);
        if (res.success) {
            toast.success(res.message);
            setItems((list) =>
                list.map((i) => ({
                    ...i,
                    is_legacy: i.id === id,
                    is_featured: i.id === id ? true : i.is_featured,
                }))
            );
        } else toast.error(res.message);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="font-heading text-2xl font-bold text-text-primary">
                        Initiatives &amp; ongoing programmes
                    </h2>
                    <p className="font-mono text-xs text-text-secondary mt-1 max-w-xl leading-relaxed">
                        Featured items appear on the homepage. For images: put a file in{" "}
                        <code className="text-accent-gold">public/</code> (e.g.{" "}
                        <code className="text-accent-gold">indru.jpeg</code>) and set Hero Image URL to{" "}
                        <code className="text-accent-gold">/indru.jpeg</code>. Daily series: set Impact
                        Number to <code className="text-accent-gold">Daily</code>.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setEditing(null);
                        setDrawerOpen(true);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold text-sm px-5 py-2.5 rounded-full hover:scale-[1.03] transition-transform shrink-0"
                >
                    <Plus size={16} /> New
                </button>
            </div>

            <div className="space-y-3">
                {items.map((init) => (
                    <div
                        key={init.id}
                        className="glass-panel rounded-2xl p-5 flex items-center justify-between group gap-3"
                    >
                        <div className="flex items-center gap-4 min-w-0">
                            {init.hero_image_url && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={init.hero_image_url}
                                    alt=""
                                    className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                                />
                            )}
                            <div className="min-w-0">
                                <h4 className="font-heading font-bold text-text-primary flex flex-wrap items-center gap-2">
                                    {init.title}
                                    {init.is_legacy && (
                                        <span className="font-mono text-[9px] uppercase tracking-wider text-accent-gold border border-accent-gold/30 rounded-full px-2 py-0.5">
                                            Legacy
                                        </span>
                                    )}
                                    {init.is_featured && (
                                        <span className="font-mono text-[9px] uppercase tracking-wider text-accent-teal border border-accent-teal/30 rounded-full px-2 py-0.5">
                                            Featured
                                        </span>
                                    )}
                                    {(init.impact_stat || "").toString().toLowerCase().includes("daily") && (
                                        <span className="font-mono text-[9px] uppercase tracking-wider text-accent-cranberry border border-accent-cranberry/30 rounded-full px-2 py-0.5">
                                            Daily
                                        </span>
                                    )}
                                </h4>
                                <p className="font-mono text-xs text-text-secondary truncate">
                                    {init.category} · /{init.slug}
                                    {init.hero_image_url ? ` · ${init.hero_image_url}` : ""}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => setEditing(init)}
                                className="p-2 rounded-xl bg-white/5 text-text-secondary hover:text-accent-gold"
                                title="Edit"
                            >
                                <Pencil size={14} />
                            </button>
                            {!init.is_legacy && (
                                <button
                                    type="button"
                                    onClick={() => handleLegacy(init.id)}
                                    title="Set as sole legacy project"
                                    className="p-2 rounded-xl bg-white/5 text-text-secondary hover:text-accent-gold"
                                >
                                    <Star size={14} />
                                </button>
                            )}
                            <Link
                                href={`/initiatives/${init.slug}`}
                                target="_blank"
                                className="p-2 rounded-xl bg-white/5 text-text-secondary hover:text-text-primary"
                            >
                                <ExternalLink size={14} />
                            </Link>
                            <button
                                type="button"
                                onClick={() => handleDelete(init.id)}
                                className="p-2 rounded-xl bg-accent-red/10 text-accent-red"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <CMSDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="New initiative / daily programme"
            >
                <InitiativeForm
                    loading={loading}
                    onSubmit={handleCreate}
                    defaults={{
                        is_featured: true,
                        impact_stat: "Daily",
                        impact_label: "ongoing series",
                    }}
                />
            </CMSDrawer>

            <CMSDrawer
                open={Boolean(editing)}
                onClose={() => setEditing(null)}
                title={editing ? `Edit ${editing.title}` : "Edit"}
            >
                {editing && (
                    <InitiativeForm
                        loading={loading}
                        onSubmit={handleUpdate}
                        defaults={editing}
                    />
                )}
            </CMSDrawer>
        </div>
    );
};

function InitiativeForm({
    loading,
    onSubmit,
    defaults,
}: {
    loading: boolean;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    defaults?: any;
}) {
    return (
        <form onSubmit={onSubmit} className="space-y-5">
            {[
                { name: "title", label: "Title", required: true, value: defaults?.title },
                {
                    name: "category",
                    label: "Category / Avenue",
                    required: true,
                    value: defaults?.category,
                },
                {
                    name: "hero_image_url",
                    label: "Hero image path (e.g. /indru.jpeg or full URL)",
                    value: defaults?.hero_image_url,
                },
                {
                    name: "impact_stat",
                    label: "Impact / cadence (use “Daily” for ongoing series)",
                    value: defaults?.impact_stat,
                },
                {
                    name: "impact_label",
                    label: "Impact label",
                    value: defaults?.impact_label,
                },
                {
                    name: "display_order",
                    label: "Display order (number)",
                    value: defaults?.display_order ?? 0,
                },
            ].map((f) => (
                <div key={f.name}>
                    <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">
                        {f.label}
                    </label>
                    <input
                        name={f.name}
                        required={f.required}
                        defaultValue={f.value ?? ""}
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold"
                    />
                </div>
            ))}
            <div>
                <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">
                    Short description (cards)
                </label>
                <textarea
                    name="short_description"
                    rows={2}
                    defaultValue={defaults?.short_description ?? ""}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold resize-none"
                />
            </div>
            <div>
                <label className="block font-mono text-xs text-text-secondary mb-2 uppercase tracking-widest">
                    Full description (detail page)
                </label>
                <textarea
                    name="full_description"
                    rows={5}
                    defaultValue={defaults?.full_description ?? ""}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold resize-none"
                />
            </div>
            <label className="flex items-center gap-2 font-mono text-xs text-text-secondary">
                <input
                    type="checkbox"
                    name="is_featured_check"
                    defaultChecked={defaults?.is_featured !== false}
                    className="rounded"
                />
                Featured on homepage
            </label>
            <label className="flex items-center gap-2 font-mono text-xs text-text-secondary">
                <input
                    type="checkbox"
                    name="is_signature_check"
                    defaultChecked={Boolean(defaults?.is_signature)}
                    className="rounded"
                />
                Signature project (signed block on homepage)
            </label>
            <label className="flex items-center gap-2 font-mono text-xs text-text-secondary">
                <input
                    type="checkbox"
                    name="is_legacy"
                    defaultChecked={Boolean(defaults?.is_legacy)}
                    className="rounded"
                />
                Sole Legacy flagship (clears previous)
            </label>
            <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold rounded-full hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
                {loading ? "Saving…" : defaults?.id ? "Save changes" : "Create"}
            </button>
        </form>
    );
}
