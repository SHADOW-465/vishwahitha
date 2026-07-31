import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublicAnnouncements } from "@/lib/actions";

function formatDate(value: string | Date | null | undefined) {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/**
 * Act II opener · the board's own voice.
 *
 * Announcements only. This used to also list the next three events, which
 * the events ledger immediately below repeated — the reader met the same
 * dates twice and the act lost its shape. The masthead rule stays: it's the
 * one deliberate kicker on the page, and it belongs on a bulletin.
 */
export async function ClubBulletin() {
    const announcements = await getPublicAnnouncements();

    const latestNotes =
        announcements && announcements.length > 0
            ? announcements.slice(0, 3)
            : [
                  {
                      id: "fallback-a1",
                      title: "Club bulletin updates appear here",
                      body: "Pinned and public announcements from the board will surface in this strip.",
                      created_at: null as string | null,
                      is_pinned: false,
                  },
              ];

    const todayLabel = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div id="now" aria-labelledby="now-heading" className="w-full">
            <div className="max-w-7xl mx-auto px-6">
                {/* Masthead */}
                <div
                    className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b-2 border-white/15"
                    data-reveal
                >
                    <h2
                        id="now-heading"
                        className="font-heading font-extrabold text-step-3 text-text-primary tracking-tight"
                    >
                        From the board
                    </h2>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary shrink-0 pb-1">
                        {todayLabel}
                        <span className="mx-2 text-white/25">·</span>
                        RI District 3234
                    </p>
                </div>

                <div className="divide-y divide-white/10">
                    {latestNotes.map((note: {
                        id: string;
                        title: string;
                        body?: string | null;
                        content?: string | null;
                        created_at?: string | null;
                        is_pinned?: boolean;
                    }, index: number) => {
                        const body =
                            note.body || note.content || "Open announcements for the full note.";
                        const excerpt =
                            body.length > 220 ? `${body.slice(0, 220).trim()}…` : body;
                        const lead = index === 0;
                        return (
                            <article
                                key={note.id}
                                className="py-8 md:py-10 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8"
                                data-reveal
                                data-reveal-delay={index * 100}
                            >
                                <div className="md:col-span-3 flex flex-wrap items-center gap-2 md:block">
                                    <time className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
                                        {formatDate(note.created_at) ?? "Club notice"}
                                    </time>
                                    {note.is_pinned && (
                                        <span className="md:mt-2 md:inline-block font-mono text-[9px] uppercase tracking-[0.2em] text-cranberry-ink">
                                            Pinned
                                        </span>
                                    )}
                                </div>
                                <div className="md:col-span-9 min-w-0">
                                    <h3
                                        className={`font-heading font-bold text-text-primary tracking-tight ${
                                            lead ? "text-step-2" : "text-step-1"
                                        }`}
                                    >
                                        {note.title}
                                    </h3>
                                    <p
                                        className={`mt-3 text-text-secondary measure ${
                                            lead ? "text-step-0" : "text-step--1"
                                        }`}
                                    >
                                        {excerpt}
                                    </p>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <Link
                    href="/announcements"
                    className="inline-flex items-center gap-1.5 mt-2 text-step--1 text-gold-ink hover:text-accent-gold-light transition-colors"
                >
                    All announcements <ArrowRight size={13} />
                </Link>
            </div>
        </div>
    );
}
