"use client";

import { useState, useTransition } from "react";
import { updateIdeaStatus } from "@/lib/server-actions";
import toast from "react-hot-toast";

const STATUSES = ["new", "under_review", "planned", "done", "declined"] as const;

export function IdeasModeration({ ideas: initial }: { ideas: any[] }) {
    const [ideas, setIdeas] = useState(initial);
    const [pending, startTransition] = useTransition();

    function setStatus(id: string, status: string) {
        startTransition(async () => {
            const res = await updateIdeaStatus(id, status);
            if (res.success) {
                toast.success(res.message);
                setIdeas((list) => list.map((i) => (i.id === id ? { ...i, status } : i)));
            } else toast.error(res.message);
        });
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-heading text-2xl font-bold text-text-primary">Ideas moderation</h2>
                <p className="font-mono text-xs text-text-secondary mt-1">
                    Member proposals from the clubroom. Mark status so the board pipeline is clear.
                </p>
            </div>

            {ideas.length === 0 ? (
                <p className="font-mono text-sm text-text-secondary glass-panel rounded-2xl p-8 text-center">
                    No ideas posted yet.
                </p>
            ) : (
                <ul className="space-y-4">
                    {ideas.map((idea) => (
                        <li key={idea.id} className="glass-panel rounded-2xl p-5 border border-white/5">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="min-w-0">
                                    <h3 className="font-heading font-bold text-text-primary">{idea.title}</h3>
                                    <p className="mt-2 font-mono text-xs text-text-secondary leading-relaxed">
                                        {idea.body}
                                    </p>
                                    <p className="mt-2 font-mono text-[10px] text-text-secondary">
                                        {idea.vote_count ?? 0} votes · {idea.status}
                                    </p>
                                </div>
                                <select
                                    disabled={pending}
                                    value={idea.status}
                                    onChange={(e) => setStatus(idea.id, e.target.value)}
                                    className="shrink-0 bg-black/50 border border-white/10 rounded-xl px-3 py-2 font-mono text-xs text-text-primary"
                                >
                                    {STATUSES.map((s) => (
                                        <option key={s} value={s}>
                                            {s.replace("_", " ")}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
