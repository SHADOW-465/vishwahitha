"use client";

import { useState, useTransition } from "react";
import { submitContactMessage } from "@/lib/server-actions";

export function ContactForm() {
    const [pending, startTransition] = useTransition();
    const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        fd.set("kind", "contact");
        startTransition(async () => {
            const res = await submitContactMessage(fd);
            setStatus({ ok: res.success, text: res.message });
            if (res.success) form.reset();
        });
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <label className="block min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                    Name *
                </span>
                <input
                    name="name"
                    required
                    className="mt-1.5 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50"
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
                    className="mt-1.5 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50"
                />
            </label>
            <label className="block min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                    Message *
                </span>
                <textarea
                    name="message"
                    required
                    rows={5}
                    className="mt-1.5 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-gold/50 resize-y min-h-[120px]"
                />
            </label>
            <button
                type="submit"
                disabled={pending}
                className="rounded-full bg-accent-cranberry text-text-primary font-bold text-sm px-8 py-3.5 disabled:opacity-60 hover:bg-[#e01872] transition-colors"
            >
                {pending ? "Sending…" : "Send message"}
            </button>
            {status && (
                <p
                    className={`font-mono text-xs ${status.ok ? "text-green-400" : "text-accent-red"}`}
                    role="status"
                >
                    {status.text}
                </p>
            )}
        </form>
    );
}
