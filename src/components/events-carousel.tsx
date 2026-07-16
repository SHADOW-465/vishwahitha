import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { getPublicEvents } from "@/lib/actions";

function formatDate(value: string | null | undefined) {
    if (!value) return "Date TBA";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "Date TBA";
    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

/** P1-5 — Home events strip; deep-links to /events */
export async function EventsCarousel() {
    const events = await getPublicEvents(8);
    const now = Date.now();
    const upcoming = (events || []).filter(
        (e: { date?: string }) => e.date && new Date(e.date).getTime() >= now
    );
    const display = upcoming.length > 0 ? upcoming.slice(0, 6) : [];

    return (
        <section id="events-preview" className="py-20 md:py-24 px-6 w-full max-w-7xl mx-auto border-t border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-cranberry">
                        Next up
                    </p>
                    <h2 className="mt-1 font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-primary tracking-tight text-balance">
                        Club <span className="font-display-drama gold-text">events</span>
                    </h2>
                    <p className="font-mono text-sm text-text-secondary mt-2 max-w-md leading-relaxed">
                        Upcoming service, meetings, and fellowship — open the full calendar for past and online sessions.
                    </p>
                </div>
                <Link
                    href="/events"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-gold hover:text-accent-gold-light transition-colors shrink-0"
                >
                    Full calendar <ArrowRight size={12} />
                </Link>
            </div>

            {display.length === 0 ? (
                <div className="glass-panel rounded-2xl border border-white/5 p-10 text-center">
                    <CalendarDays className="mx-auto text-accent-gold/60 mb-3" size={22} />
                    <p className="font-heading font-bold text-text-primary">No upcoming events right now</p>
                    <p className="font-mono text-xs text-text-secondary mt-2 max-w-sm mx-auto leading-relaxed">
                        Check back soon, or browse past notices and signature projects.
                    </p>
                    <Link
                        href="/events"
                        className="inline-flex mt-5 font-mono text-xs text-accent-gold border border-accent-gold/25 rounded-full px-4 py-2 hover:bg-accent-gold/10 transition-colors"
                    >
                        View full calendar
                    </Link>
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin -mx-1 px-1">
                    {display.map((event: {
                        id: string;
                        title: string;
                        date?: string;
                        location?: string;
                        is_online?: boolean;
                    }) => (
                        <Link
                            key={event.id}
                            href={`/events/${event.id}`}
                            className="snap-start shrink-0 w-[min(100%,280px)] sm:w-[300px] glass-panel rounded-2xl border border-white/5 p-6 hover:border-accent-cranberry/30 transition-colors group min-w-0"
                        >
                            <p className="font-mono text-[10px] uppercase tracking-wider text-accent-cranberry">
                                {formatDate(event.date)}
                                {event.is_online ? " · Online" : ""}
                            </p>
                            <h3 className="mt-2 font-heading font-bold text-lg text-text-primary group-hover:text-accent-cranberry transition-colors leading-snug line-clamp-2">
                                {event.title}
                            </h3>
                            {event.location && (
                                <p className="mt-2 font-mono text-xs text-text-secondary truncate">
                                    {event.location}
                                </p>
                            )}
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
