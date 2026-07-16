"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeTutorial } from "@/lib/server-actions";

const STEPS = [
    {
        title: "What is Rotaract?",
        body: "Rotaract is Rotary International’s service club for young adults. Members run community projects, build leadership skills, and connect across Districts worldwide.",
    },
    {
        title: "Why join?",
        body: "You gain real project experience, a professional network, and a structured way to serve Chennai — not just attend meetings.",
    },
    {
        title: "What members do",
        body: "Service days, club meetings, District events, and committee work across Club, Community, Professional, and International avenues.",
    },
    {
        title: "How Vishwahita works",
        body: "Chartered 1999, District 3234, sponsored by Rotary Club of Madras Industrial City. Signature projects (like Vaagai), weekly prompts, and board-led calendars live on this site.",
    },
    {
        title: "Your first action",
        body: "RSVP to the next event under Member → Events, or answer This week’s prompt under Participate. Small consistency beats big intentions.",
    },
];

export function LearnClient({ alreadyComplete }: { alreadyComplete: boolean }) {
    const [step, setStep] = useState(0);
    const [done, setDone] = useState(alreadyComplete);
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const isLast = step === STEPS.length - 1;

    function finish() {
        startTransition(async () => {
            const res = await completeTutorial();
            if (res.success) {
                setDone(true);
                router.refresh();
            }
        });
    }

    if (done) {
        return (
            <div className="glass-panel rounded-[1.75rem] border border-white/5 p-8 text-center space-y-4">
                <p className="font-heading font-bold text-2xl text-text-primary">
                    Tutorial complete
                </p>
                <p className="font-mono text-sm text-text-secondary">
                    You’re ready for the clubroom. RSVP to an event or answer this week’s prompt.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <a
                        href="/member/events"
                        className="rounded-full bg-gradient-to-r from-accent-cranberry to-accent-gold text-text-primary font-bold text-sm px-5 py-2.5"
                    >
                        Events
                    </a>
                    <a
                        href="/member/participate"
                        className="rounded-full border border-white/15 text-text-primary font-mono text-xs px-5 py-2.5"
                    >
                        Participate
                    </a>
                </div>
            </div>
        );
    }

    const current = STEPS[step];

    return (
        <div className="glass-panel rounded-[1.75rem] border border-white/5 p-6 sm:p-8 space-y-6">
            <div className="flex gap-1">
                {STEPS.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                            i <= step ? "bg-accent-gold" : "bg-white/10"
                        }`}
                    />
                ))}
            </div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-accent-gold">
                Step {step + 1} of {STEPS.length}
            </p>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-text-primary text-balance">
                {current.title}
            </h2>
            <p className="font-mono text-sm text-text-secondary leading-relaxed max-w-2xl">
                {current.body}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
                {step > 0 && (
                    <button
                        type="button"
                        onClick={() => setStep((s) => s - 1)}
                        className="rounded-full border border-white/15 px-5 py-2.5 font-mono text-xs text-text-secondary"
                    >
                        Back
                    </button>
                )}
                {!isLast ? (
                    <button
                        type="button"
                        onClick={() => setStep((s) => s + 1)}
                        className="rounded-full bg-gradient-to-r from-accent-cranberry to-accent-gold text-text-primary font-bold text-sm px-6 py-2.5"
                    >
                        Continue
                    </button>
                ) : (
                    <button
                        type="button"
                        disabled={pending}
                        onClick={finish}
                        className="rounded-full bg-gradient-to-r from-accent-cranberry to-accent-gold text-text-primary font-bold text-sm px-6 py-2.5 disabled:opacity-60"
                    >
                        {pending ? "Saving…" : "Mark complete"}
                    </button>
                )}
            </div>
        </div>
    );
}
