"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { toggleRSVP } from "@/lib/server-actions";

export function EventRsvpButton({
    eventId,
    initialStatus,
}: {
    eventId: string;
    initialStatus: string | null;
}) {
    const { isSignedIn } = useAuth();
    const [status, setStatus] = useState(initialStatus);
    const [pending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    if (!isSignedIn) {
        return (
            <Link
                href="/sign-in"
                className="inline-flex rounded-full border border-white/15 px-6 py-3 font-mono text-xs text-text-primary hover:border-accent-gold/40 transition-colors"
            >
                Sign in to RSVP
            </Link>
        );
    }

    const attending = status === "attending";

    return (
        <div className="space-y-2">
            <button
                type="button"
                disabled={pending}
                onClick={() => {
                    setError(null);
                    startTransition(async () => {
                        const res = await toggleRSVP(eventId, status);
                        if (!res.success) {
                            setError(res.message);
                            return;
                        }
                        setStatus(attending ? "apologies" : "attending");
                    });
                }}
                className={`inline-flex rounded-full px-6 py-3 font-bold text-sm transition-opacity disabled:opacity-60 ${
                    attending
                        ? "bg-white/10 border border-white/15 text-text-primary"
                        : "bg-accent-cranberry text-text-primary"
                }`}
            >
                {pending ? "Updating…" : attending ? "You're going · Change" : "RSVP — I'm going"}
            </button>
            {error && (
                <p className="font-mono text-xs text-accent-red" role="status">
                    {error}
                </p>
            )}
        </div>
    );
}
