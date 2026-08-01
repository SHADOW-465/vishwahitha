"use client";

import { useState, useTransition } from "react";
import { createPastPresident, deletePastPresident } from "@/lib/server-actions";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

type President = {
    id: string;
    name: string;
    term: string;
    note?: string | null;
    image_url?: string | null;
    display_order?: number | null;
};

export function PastPresidentsManager({ presidents: initial }: { presidents: President[] }) {
    const [list, setList] = useState<President[]>(initial ?? []);
    const [pending, startTransition] = useTransition();

    function onCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        startTransition(async () => {
            const res = await createPastPresident(fd);
            if (res.success) {
                toast.success(res.message);
                if (res.data) {
                    setList((p) =>
                        [...p, res.data].sort(
                            (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
                        )
                    );
                }
                form.reset();
            } else toast.error(res.message);
        });
    }

    function onDelete(id: string, name: string) {
        if (!confirm(`Remove ${name} from the roll of past presidents?`)) return;
        startTransition(async () => {
            const res = await deletePastPresident(id);
            if (res.success) {
                toast.success(res.message);
                setList((p) => p.filter((x) => x.id !== id));
            } else toast.error(res.message);
        });
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="font-heading text-2xl font-bold text-text-primary">
                    Past Presidents
                </h2>
                <p className="font-mono text-xs text-text-secondary mt-1">
                    The succession roll shown on the public About page. Lowest order number
                    appears first — use 1 for the most recent past president.
                </p>
            </div>

            <form
                onSubmit={onCreate}
                className="glass-panel rounded-2xl p-6 space-y-4 border border-white/5"
            >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                        name="name"
                        required
                        placeholder="Name (e.g. Rtr. Ashwin)"
                        className="sm:col-span-2 bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-text-primary placeholder:text-text-secondary"
                    />
                    <input
                        name="term"
                        required
                        placeholder="Term (e.g. 2024–25)"
                        className="bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-text-primary placeholder:text-text-secondary"
                    />
                </div>
                <input
                    name="note"
                    placeholder="One line on what defined the term (optional)"
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-text-primary placeholder:text-text-secondary"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                        name="image_url"
                        placeholder="Portrait URL (optional)"
                        className="sm:col-span-2 bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-text-primary placeholder:text-text-secondary"
                    />
                    <input
                        name="display_order"
                        type="number"
                        min={0}
                        defaultValue={list.length + 1}
                        aria-label="Display order"
                        className="bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-text-primary"
                    />
                </div>
                <button
                    type="submit"
                    disabled={pending}
                    className="bg-accent-gold text-primary font-bold text-sm px-6 py-3 rounded-full disabled:opacity-50 transition-opacity"
                >
                    {pending ? "Saving…" : "Add to roll"}
                </button>
            </form>

            {list.length === 0 ? (
                <p className="font-mono text-xs text-text-secondary">
                    No past presidents recorded yet. The About page shows a short
                    &ldquo;being compiled&rdquo; note until the first one is added.
                </p>
            ) : (
                <ul className="border-t border-white/10">
                    {list.map((p) => (
                        <li
                            key={p.id}
                            className="border-b border-white/10 py-4 flex items-center gap-4"
                        >
                            <span className="font-mono text-xs text-accent-gold w-24 shrink-0 tabular-nums">
                                {p.term}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="font-heading font-bold text-text-primary truncate">
                                    {p.name}
                                </p>
                                {p.note && (
                                    <p className="font-mono text-xs text-text-secondary truncate">
                                        {p.note}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => onDelete(p.id, p.name)}
                                disabled={pending}
                                aria-label={`Remove ${p.name}`}
                                className="p-2 rounded-xl text-text-secondary hover:text-accent-red hover:bg-white/5 transition-colors disabled:opacity-50 shrink-0"
                            >
                                <Trash2 size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
