"use client";

import { useState, useTransition } from "react";
import { createIdea, voteIdea, submitPulseResponse, addIdeaComment } from "@/lib/server-actions";

type Idea = {
    id: string;
    title: string;
    body: string;
    status: string;
    vote_count: number;
    author_id: string;
};

type IdeaComment = {
    id: string;
    idea_id: string;
    author_id: string;
    body: string;
    created_at?: string;
};

type PulseForm = {
    id: string;
    week_label: string;
    questions: Array<{ id: string; type: string; question: string; options?: string[] }>;
};

export function ParticipateClient({
    form,
    hasSubmitted,
    ideas,
    userId,
    votedIds,
    comments: initialComments,
}: {
    form: PulseForm | null;
    hasSubmitted: boolean;
    ideas: Idea[];
    userId: string;
    votedIds: string[];
    comments: IdeaComment[];
}) {
    const [tab, setTab] = useState<"prompt" | "ideas">("prompt");
    const [pending, startTransition] = useTransition();
    const [msg, setMsg] = useState<string | null>(null);
    const [answers, setAnswers] = useState<Record<string, string | number>>({});
    const [comment, setComment] = useState("");
    const [pulseDone, setPulseDone] = useState(hasSubmitted);
    const [localVotes, setLocalVotes] = useState<Set<string>>(new Set(votedIds));
    const [localIdeas, setLocalIdeas] = useState(ideas);
    const [localComments, setLocalComments] = useState(initialComments);
    const [draftByIdea, setDraftByIdea] = useState<Record<string, string>>({});

    function submitPulse() {
        if (!form) return;
        setMsg(null);
        startTransition(async () => {
            const fd = new FormData();
            fd.set("form_id", form.id);
            fd.set("answers", JSON.stringify(answers));
            fd.set("comment", comment);
            const res = await submitPulseResponse(fd);
            setMsg(res.message);
            if (res.success) setPulseDone(true);
        });
    }

    function postIdea(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setMsg(null);
        startTransition(async () => {
            const res = await createIdea(fd);
            setMsg(res.message);
            if (res.success && res.data) {
                setLocalIdeas((prev) => [res.data as Idea, ...prev]);
                e.currentTarget.reset();
            }
        });
    }

    function onVote(id: string) {
        if (localVotes.has(id)) {
            setMsg("You already voted for this idea.");
            return;
        }
        startTransition(async () => {
            const res = await voteIdea(id);
            setMsg(res.message);
            if (res.success) {
                setLocalVotes((s) => new Set(s).add(id));
                setLocalIdeas((prev) =>
                    prev.map((i) =>
                        i.id === id ? { ...i, vote_count: i.vote_count + 1 } : i
                    )
                );
            }
        });
    }

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                {(
                    [
                        ["prompt", "This week's prompt"],
                        ["ideas", "Idea board"],
                    ] as const
                ).map(([key, label]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => setTab(key)}
                        className={`rounded-full px-4 py-2 font-mono text-xs border transition-colors ${
                            tab === key
                                ? "border-accent-gold/40 bg-accent-gold/10 text-accent-gold"
                                : "border-white/10 text-text-secondary"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {msg && (
                <p className="font-mono text-xs text-text-secondary" role="status">
                    {msg}
                </p>
            )}

            {tab === "prompt" && (
                <div className="glass-panel rounded-[1.75rem] border border-white/5 p-6 space-y-6">
                    {!form ? (
                        <p className="font-mono text-sm text-text-secondary">
                            No active weekly prompt. Check back after the board posts one.
                        </p>
                    ) : pulseDone ? (
                        <div className="text-center py-10 space-y-2">
                            <p className="font-heading font-bold text-xl text-text-primary">
                                Prompt answered
                            </p>
                            <p className="font-mono text-xs text-text-secondary">
                                {form.week_label} · see you next week
                            </p>
                        </div>
                    ) : (
                        <>
                            <div>
                                <h2 className="font-heading font-bold text-2xl text-text-primary">
                                    {form.week_label}
                                </h2>
                                <p className="font-mono text-xs text-text-secondary mt-1">
                                    Weekly habit · low friction
                                </p>
                            </div>
                            {(form.questions || []).map((q) => (
                                <div key={q.id}>
                                    <p className="font-mono text-sm text-text-primary mb-3">
                                        {q.question}
                                    </p>
                                    {q.type === "rating" && (
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((n) => (
                                                <button
                                                    key={n}
                                                    type="button"
                                                    onClick={() =>
                                                        setAnswers((a) => ({ ...a, [q.id]: n }))
                                                    }
                                                    className={`w-10 h-10 rounded-xl font-bold border ${
                                                        answers[q.id] === n
                                                            ? "bg-accent-gold text-primary border-accent-gold"
                                                            : "border-white/10 text-text-secondary"
                                                    }`}
                                                >
                                                    {n}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {(q.type === "text" || !q.type) && (
                                        <textarea
                                            value={String(answers[q.id] ?? "")}
                                            onChange={(e) =>
                                                setAnswers((a) => ({
                                                    ...a,
                                                    [q.id]: e.target.value,
                                                }))
                                            }
                                            rows={3}
                                            className="w-full rounded-2xl bg-black/40 border border-white/10 p-3 text-sm text-text-primary"
                                        />
                                    )}
                                </div>
                            ))}
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Optional comment"
                                rows={2}
                                className="w-full rounded-2xl bg-black/40 border border-white/10 p-3 text-sm text-text-primary"
                            />
                            <button
                                type="button"
                                disabled={pending}
                                onClick={submitPulse}
                                className="rounded-full bg-accent-cranberry text-text-primary font-bold text-sm px-6 py-3 disabled:opacity-60"
                            >
                                {pending ? "Submitting…" : "Submit answer"}
                            </button>
                        </>
                    )}
                </div>
            )}

            {tab === "ideas" && (
                <div className="space-y-6">
                    <form
                        onSubmit={postIdea}
                        className="glass-panel rounded-[1.75rem] border border-white/5 p-6 space-y-4"
                    >
                        <h2 className="font-heading font-bold text-xl text-text-primary">
                            Post an idea
                        </h2>
                        <input
                            name="title"
                            required
                            placeholder="Short title"
                            className="w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-text-primary"
                        />
                        <textarea
                            name="body"
                            required
                            rows={3}
                            placeholder="What should the club do?"
                            className="w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-text-primary"
                        />
                        <button
                            type="submit"
                            disabled={pending}
                            className="rounded-full border border-accent-gold/40 text-accent-gold font-mono text-xs px-5 py-2.5 disabled:opacity-60"
                        >
                            {pending ? "Posting…" : "Share idea"}
                        </button>
                    </form>

                    <ul className="space-y-4">
                        {localIdeas.length === 0 && (
                            <li className="font-mono text-sm text-text-secondary text-center py-8">
                                No ideas yet — be the first.
                            </li>
                        )}
                        {localIdeas.map((idea) => {
                            const ideaComments = localComments.filter((c) => c.idea_id === idea.id);
                            return (
                            <li
                                key={idea.id}
                                className="glass-panel rounded-2xl border border-white/5 p-5"
                            >
                                <div className="flex justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="font-heading font-bold text-text-primary">
                                            {idea.title}
                                        </h3>
                                        <p className="mt-2 font-mono text-xs text-text-secondary leading-relaxed">
                                            {idea.body}
                                        </p>
                                        <p className="mt-2 font-mono text-[10px] text-text-secondary uppercase tracking-wider">
                                            {idea.status.replace("_", " ")}
                                            {idea.author_id === userId ? " · yours" : ""}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        disabled={pending || localVotes.has(idea.id)}
                                        onClick={() => onVote(idea.id)}
                                        className="shrink-0 h-fit rounded-full border border-white/15 px-3 py-2 font-mono text-xs text-text-primary disabled:opacity-50"
                                    >
                                        ▲ {idea.vote_count}
                                    </button>
                                </div>
                                {ideaComments.length > 0 && (
                                    <ul className="mt-4 space-y-2 border-t border-white/5 pt-3">
                                        {ideaComments.map((c) => (
                                            <li key={c.id} className="font-mono text-[11px] text-text-secondary">
                                                {c.body}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <form
                                    className="mt-3 flex gap-2"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const body = (draftByIdea[idea.id] || "").trim();
                                        if (!body) return;
                                        startTransition(async () => {
                                            const fd = new FormData();
                                            fd.set("idea_id", idea.id);
                                            fd.set("body", body);
                                            const res = await addIdeaComment(fd);
                                            setMsg(res.message);
                                            if (res.success && res.data) {
                                                setLocalComments((prev) => [...prev, res.data as IdeaComment]);
                                                setDraftByIdea((d) => ({ ...d, [idea.id]: "" }));
                                            }
                                        });
                                    }}
                                >
                                    <input
                                        value={draftByIdea[idea.id] || ""}
                                        onChange={(e) =>
                                            setDraftByIdea((d) => ({ ...d, [idea.id]: e.target.value }))
                                        }
                                        placeholder="Light comment…"
                                        className="flex-1 min-w-0 rounded-full bg-black/40 border border-white/10 px-3 py-2 text-xs text-text-primary"
                                    />
                                    <button
                                        type="submit"
                                        disabled={pending}
                                        className="shrink-0 font-mono text-[10px] text-accent-gold px-3"
                                    >
                                        Post
                                    </button>
                                </form>
                            </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
