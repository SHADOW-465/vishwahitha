"use client";

import { useState, useTransition } from "react";
import { createMilestone, deleteMilestone } from "@/lib/server-actions";
import toast from "react-hot-toast";

export function MilestoneManager({ milestones: initial }: { milestones: any[] }) {
    const [list, setList] = useState(initial);
    const [pending, startTransition] = useTransition();

    function onCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        startTransition(async () => {
            const res = await createMilestone(fd);
            if (res.success) {
                toast.success(res.message);
                if (res.data) setList((m) => [...m, res.data].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)));
                form.reset();
            } else toast.error(res.message);
        });
    }

    function onDelete(id: string) {
        if (!confirm("Delete milestone?")) return;
        startTransition(async () => {
            const res = await deleteMilestone(id);
            if (res.success) {
                toast.success(res.message);
                setList((m) => m.filter((x) => x.id !== id));
            } else toast.error(res.message);
        });
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="font-heading text-2xl font-bold text-text-primary">Milestones</h2>
                <p className="font-mono text-xs text-text-secondary mt-1">
                    Compact timeline points for the public story (charter, growth, this term).
                </p>
            </div>

            <form onSubmit={onCreate} className="glass-panel rounded-2xl p-6 space-y-4 border border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                        name="year"
                        required
                        placeholder="Year (e.g. 1999)"
                        className="bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-text-primary"
                    />
                    <input
                        name="title"
                        required
                        placeholder="Title"
                        className="sm:col-span-2 bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-text-primary"
                    />
                </div>
                <textarea
                    name="body"
                    rows={2}
                    placeholder="Short description"
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-text-primary resize-none"
                />
                <input
                    name="display_order"
                    type="number"
                    defaultValue={list.length + 1}
                    className="w-32 bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-text-primary"
                />
                <button
                    type="submit"
                    disabled={pending}
                    className="block rounded-full bg-accent-gold text-primary font-bold text-sm px-6 py-2.5 disabled:opacity-50"
                >
                    Add milestone
                </button>
            </form>

            <ul className="space-y-3">
                {list.map((m) => (
                    <li
                        key={m.id}
                        className="glass-panel rounded-2xl p-4 flex justify-between gap-4 border border-white/5"
                    >
                        <div>
                            <p className="font-mono text-[10px] text-accent-gold">{m.year}</p>
                            <p className="font-heading font-bold text-text-primary">{m.title}</p>
                            {m.body && (
                                <p className="font-mono text-xs text-text-secondary mt-1">{m.body}</p>
                            )}
                        </div>
                        <button
                            type="button"
                            disabled={pending}
                            onClick={() => onDelete(m.id)}
                            className="font-mono text-xs text-accent-red shrink-0"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
