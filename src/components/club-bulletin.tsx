import Link from "next/link";
import { ArrowRight, CalendarDays, Megaphone } from "lucide-react";
import { getPublicAnnouncements, getPublicEvents } from "@/lib/actions";

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

function formatWeekday(value: string | Date | null | undefined) {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-IN", { weekday: "long" });
}

/**
 * Club pulse: real upcoming events + board notices only.
 * No invented meetings, no vanity member/project counts.
 */
export async function ClubBulletin() {
    const [events, announcements] = await Promise.all([
        getPublicEvents(),
        getPublicAnnouncements(),
    ]);

    const nextEvents = (events ?? []).slice(0, 4);
    const latestNotes = (announcements ?? []).slice(0, 3);

    const todayLabel = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <section
            id="now"
            aria-labelledby="now-heading"
            className="cinema-section relative w-full border-y border-white/10 bg-primary/80"
        >
            <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-white/5">
                <div className="min-w-0">
                    <h2
                        id="now-heading"
                        className="font-heading font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight text-balance"
                    >
                        What&apos;s on
                    </h2>
                </div>
                <p className="font-mono text-[11px] text-text-secondary shrink-0">
                    {todayLabel}
                    <span className="mx-2 text-white/20">·</span>
                    RI District 3234
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
                    <div className="lg:col-span-5 space-y-5 min-w-0">
                        <div className="flex items-center gap-2">
                            <CalendarDays size={14} className="text-accent-gold shrink-0" />
                            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-gold">
                                Upcoming
                            </span>
                        </div>

                        {nextEvents.length === 0 ? (
                            <div className="rounded-2xl border border-white/8 p-6 space-y-3">
                                <p className="font-heading font-semibold text-text-primary">
                                    No upcoming public events posted yet
                                </p>
                                <p className="font-mono text-xs text-text-secondary leading-relaxed">
                                    When the board publishes the next meeting or project day, it will
                                    appear here. Check back, or open the full calendar.
                                </p>
                                <Link
                                    href="/events"
                                    className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-gold hover:underline"
                                >
                                    Open events calendar
                                    <ArrowRight size={12} />
                                </Link>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {nextEvents.map(
                                    (event: {
                                        id: string;
                                        title: string;
                                        date?: string | null;
                                        location?: string | null;
                                    }) => {
                                        const dateLabel = formatDate(event.date);
                                        const dayLabel = formatWeekday(event.date);
                                        return (
                                            <li key={event.id}>
                                                <Link
                                                    href={`/events/${event.id}`}
                                                    className="group flex gap-4 rounded-2xl border border-white/8 p-5 hover:border-accent-cranberry/30 transition-colors"
                                                >
                                                    <div className="shrink-0 w-14 text-center border-r border-white/10 pr-3">
                                                        <p className="font-mono text-[9px] uppercase tracking-wider text-text-secondary">
                                                            {dayLabel?.slice(0, 3) ?? "TBA"}
                                                        </p>
                                                        <p className="font-heading font-bold text-sm text-text-primary mt-0.5 leading-tight">
                                                            {dateLabel ?? "Soon"}
                                                        </p>
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="font-heading font-bold text-base sm:text-lg text-text-primary leading-snug group-hover:text-accent-cranberry transition-colors">
                                                            {event.title}
                                                        </h3>
                                                        {event.location && (
                                                            <p className="font-mono text-xs text-text-secondary mt-1 truncate">
                                                                {event.location}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <ArrowRight
                                                        size={14}
                                                        className="shrink-0 self-center text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                                                    />
                                                </Link>
                                            </li>
                                        );
                                    }
                                )}
                            </ul>
                        )}

                        {nextEvents.length > 0 && (
                            <Link
                                href="/events"
                                className="inline-flex items-center gap-1.5 font-mono text-xs text-text-secondary hover:text-accent-gold transition-colors"
                            >
                                Full events calendar
                                <ArrowRight size={12} />
                            </Link>
                        )}
                    </div>

                    <div className="lg:col-span-7 space-y-5 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 min-w-0">
                                <Megaphone size={14} className="text-accent-cranberry shrink-0" />
                                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-cranberry">
                                    Board notices
                                </span>
                            </div>
                            <Link
                                href="/announcements"
                                className="font-mono text-[10px] uppercase tracking-wider text-text-secondary hover:text-text-primary transition-colors shrink-0"
                            >
                                All notices
                            </Link>
                        </div>

                        {latestNotes.length === 0 ? (
                            <div className="rounded-[1.75rem] border border-white/10 p-6 font-mono text-xs text-text-secondary leading-relaxed">
                                No public notices right now. District and club updates will land here
                                when the board posts them.
                            </div>
                        ) : (
                            <div className="rounded-[1.75rem] border border-white/10 overflow-hidden divide-y divide-white/5 bg-white/[0.02]">
                                {latestNotes.map(
                                    (
                                        note: {
                                            id: string;
                                            title: string;
                                            body?: string | null;
                                            content?: string | null;
                                            created_at?: string | null;
                                            is_pinned?: boolean;
                                        },
                                        index: number
                                    ) => {
                                        const body =
                                            note.body ||
                                            note.content ||
                                            "Open notices for the full note.";
                                        const excerpt =
                                            body.length > 140
                                                ? `${body.slice(0, 140).trim()}…`
                                                : body;
                                        return (
                                            <article
                                                key={note.id}
                                                className={`p-5 sm:p-6 ${
                                                    index === 0 ? "bg-accent-cranberry/[0.04]" : ""
                                                }`}
                                            >
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    {note.is_pinned && (
                                                        <span className="font-mono text-[9px] uppercase tracking-wider text-accent-gold border border-accent-gold/25 bg-accent-gold/10 rounded-full px-2 py-0.5">
                                                            Pinned
                                                        </span>
                                                    )}
                                                    <time className="font-mono text-[10px] text-text-secondary">
                                                        {formatDate(note.created_at) ?? "Club notice"}
                                                    </time>
                                                </div>
                                                <h3 className="font-heading font-bold text-lg sm:text-xl text-text-primary tracking-tight text-balance">
                                                    {note.title}
                                                </h3>
                                                <p className="mt-2 font-mono text-xs sm:text-sm text-text-secondary leading-relaxed max-w-2xl">
                                                    {excerpt}
                                                </p>
                                            </article>
                                        );
                                    }
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );
}
