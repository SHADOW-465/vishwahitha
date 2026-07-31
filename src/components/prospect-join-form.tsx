"use client";

import { useState, useTransition } from "react";
import { submitContactMessage } from "@/lib/server-actions";

/** P1-12 — Prospect form (does not require Clerk) */
export function ProspectJoinForm() {
    const [pending, startTransition] = useTransition();
    const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        fd.set("kind", "prospect");
        // Compose message from structured fields if free message empty
        if (!String(fd.get("message") || "").trim()) {
            const why = String(fd.get("why") || "").trim();
            fd.set("message", why || "Membership interest from website form.");
        }
        startTransition(async () => {
            const res = await submitContactMessage(fd);
            setStatus({ ok: res.success, text: res.message });
            if (res.success) form.reset();
        });
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                        Full name *
                    </span>
                    <input
                        name="name"
                        required
                        className="mt-1.5 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20"
                    />
                </label>
                <label className="block min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                        Email *
                    </span>
                    <input
                        name="email"
                        type="email"
                        required
                        className="mt-1.5 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20"
                    />
                </label>
                <label className="block min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                        Phone
                    </span>
                    <input
                        name="phone"
                        type="tel"
                        className="mt-1.5 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20"
                    />
                </label>
                <label className="block min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                        Age
                    </span>
                    <input
                        name="age"
                        className="mt-1.5 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20"
                    />
                </label>
            </div>
            <label className="block min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                    Occupation
                </span>
                <input
                    name="occupation"
                    className="mt-1.5 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20"
                />
            </label>
            <label className="block min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                    Why do you want to join? *
                </span>
                <textarea
                    name="why"
                    required
                    rows={4}
                    className="mt-1.5 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20 resize-y min-h-[100px]"
                />
            </label>
            <input type="hidden" name="message" value="" />

            <button
                type="submit"
                disabled={pending}
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-accent-cranberry to-accent-gold text-text-primary font-bold text-sm px-8 py-3.5 disabled:opacity-60 transition-opacity"
            >
                {pending ? "Sending…" : "Submit application"}
            </button>

            {status && (
                <p
                    className={`font-mono text-xs leading-relaxed ${
                        status.ok ? "text-green-400" : "text-accent-red"
                    }`}
                    role="status"
                >
                    {status.text}
                </p>
            )}
        </form>
    );
}
