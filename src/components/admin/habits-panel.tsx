"use client";

import { useState, useTransition } from "react";
import { sendWeeklyDigest, sendEventReminders } from "@/lib/server-actions";
import toast from "react-hot-toast";

export function HabitsPanel() {
    const [pending, startTransition] = useTransition();
    const [last, setLast] = useState<string | null>(null);

    function run(kind: "digest" | "remind") {
        startTransition(async () => {
            const res =
                kind === "digest" ? await sendWeeklyDigest() : await sendEventReminders();
            setLast(res.message);
            if (res.success) toast.success(res.message);
            else toast.error(res.message);
        });
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="font-heading text-2xl font-bold text-text-primary">
                    Habit amplifiers
                </h2>
                <p className="font-mono text-xs text-text-secondary mt-1 max-w-xl leading-relaxed">
                    Email members via Resend. Set <code className="text-accent-gold">RESEND_API_KEY</code>{" "}
                    (and optional <code className="text-accent-gold">RESEND_FROM</code>) in env. Without a
                    key, actions report clearly and send nothing.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel rounded-2xl border border-white/5 p-6 space-y-4">
                    <h3 className="font-heading font-bold text-text-primary">Weekly digest</h3>
                    <p className="font-mono text-xs text-text-secondary leading-relaxed">
                        Upcoming public events (14 days) + active weekly prompt. Send to every email in{" "}
                        <code>users</code>.
                    </p>
                    <button
                        type="button"
                        disabled={pending}
                        onClick={() => run("digest")}
                        className="rounded-full bg-accent-cranberry text-text-primary font-bold text-sm px-5 py-2.5 disabled:opacity-50"
                    >
                        {pending ? "Sending…" : "Send weekly digest"}
                    </button>
                </div>

                <div className="glass-panel rounded-2xl border border-white/5 p-6 space-y-4">
                    <h3 className="font-heading font-bold text-text-primary">Event reminders</h3>
                    <p className="font-mono text-xs text-text-secondary leading-relaxed">
                        Public events starting within 48 hours. One email with the full short list.
                    </p>
                    <button
                        type="button"
                        disabled={pending}
                        onClick={() => run("remind")}
                        className="rounded-full border border-accent-gold/40 text-accent-gold font-mono text-xs px-5 py-2.5 disabled:opacity-50"
                    >
                        {pending ? "Sending…" : "Send 48h reminders"}
                    </button>
                </div>
            </div>

            {last && (
                <p className="font-mono text-xs text-text-secondary" role="status">
                    Last result: {last}
                </p>
            )}
        </div>
    );
}
