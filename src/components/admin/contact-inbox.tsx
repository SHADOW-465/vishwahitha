"use client";

import { useState, useTransition } from "react";
import { deleteContactMessage } from "@/lib/server-actions";
import toast from "react-hot-toast";

export function ContactInbox({ messages: initial }: { messages: any[] }) {
    const [messages, setMessages] = useState(initial);
    const [pending, startTransition] = useTransition();

    function remove(id: string) {
        if (!confirm("Remove this message?")) return;
        startTransition(async () => {
            const res = await deleteContactMessage(id);
            if (res.success) {
                toast.success(res.message);
                setMessages((m) => m.filter((x) => x.id !== id));
            } else toast.error(res.message);
        });
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="font-heading text-2xl font-bold text-text-primary">Contact & prospects</h2>
                <p className="font-mono text-xs text-text-secondary mt-1">
                    Messages from /contact and membership applications from the home join form.
                </p>
            </div>

            {messages.length === 0 ? (
                <p className="font-mono text-sm text-text-secondary glass-panel rounded-2xl p-8 text-center">
                    Inbox empty.
                </p>
            ) : (
                <ul className="space-y-4">
                    {messages.map((m) => (
                        <li key={m.id} className="glass-panel rounded-2xl p-5 border border-white/5">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="font-mono text-[10px] uppercase tracking-wider text-accent-cranberry border border-accent-cranberry/25 rounded-full px-2 py-0.5">
                                    {m.kind || "contact"}
                                </span>
                                <time className="font-mono text-[10px] text-text-secondary">
                                    {m.created_at
                                        ? new Date(m.created_at).toLocaleString("en-IN")
                                        : ""}
                                </time>
                            </div>
                            <p className="font-heading font-bold text-text-primary">
                                {m.name}{" "}
                                <span className="font-mono text-xs font-normal text-text-secondary">
                                    · {m.email}
                                    {m.phone ? ` · ${m.phone}` : ""}
                                </span>
                            </p>
                            {(m.age || m.occupation) && (
                                <p className="font-mono text-[11px] text-text-secondary mt-1">
                                    {[m.age && `Age ${m.age}`, m.occupation].filter(Boolean).join(" · ")}
                                </p>
                            )}
                            <p className="mt-3 font-mono text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                                {m.message}
                            </p>
                            <button
                                type="button"
                                disabled={pending}
                                onClick={() => remove(m.id)}
                                className="mt-4 font-mono text-xs text-accent-red hover:underline disabled:opacity-50"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
