import Link from "next/link";
import { getPublicEventsCatalog } from "@/lib/actions";

export const revalidate = 60;

function formatDate(value: string | null | undefined) {
    if (!value) return "TBA";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "TBA";
    return d.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function EventCard({
    event,
}: {
    event: {
        id: string;
        title: string;
        date?: string;
        location?: string;
        description?: string | null;
        is_online?: boolean;
    };
}) {
    return (
        <Link
            href={`/events/${event.id}`}
            className="block glass-panel rounded-2xl border border-white/5 p-6 hover:border-accent-cranberry/30 transition-colors min-w-0 h-full"
        >
            <p className="font-mono text-[10px] uppercase tracking-wider text-accent-cranberry">
                {formatDate(event.date)}
                {event.is_online ? " · Online" : ""}
            </p>
            <h2 className="mt-2 font-heading font-bold text-xl text-text-primary leading-snug">
                {event.title}
            </h2>
            {event.location && (
                <p className="mt-2 font-mono text-xs text-text-secondary">{event.location}</p>
            )}
            {event.description && (
                <p className="mt-3 font-mono text-xs text-text-secondary line-clamp-3 leading-relaxed">
                    {event.description}
                </p>
            )}
        </Link>
    );
}

export default async function EventsPage({
    searchParams,
}: {
    searchParams: Promise<{ filter?: string }>;
}) {
    const { filter: rawFilter } = await searchParams;
    const filter = rawFilter === "past" || rawFilter === "online" ? rawFilter : "upcoming";
    const { upcoming, past, online } = await getPublicEventsCatalog();

    const list =
        filter === "past" ? past : filter === "online" ? online : upcoming;

    const tabs = [
        { key: "upcoming", label: "Upcoming", count: upcoming.length },
        { key: "past", label: "Past", count: past.length },
        { key: "online", label: "Online", count: online.length },
    ] as const;

    return (
        <main className="min-h-screen bg-primary pt-28 md:pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-cranberry">
                    Calendar
                </p>
                <h1 className="mt-2 font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-text-primary tracking-tighter text-balance">
                    Club <span className="font-display-drama gold-text">events</span>
                </h1>
                <p className="mt-3 font-mono text-sm text-text-secondary max-w-xl leading-relaxed">
                    Meetings, service days, fellowship, and online sessions for Rotaract Club of Vishwahita · District 3234.
                </p>

                <div className="mt-10 flex flex-wrap gap-2">
                    {tabs.map((t) => (
                        <Link
                            key={t.key}
                            href={t.key === "upcoming" ? "/events" : `/events?filter=${t.key}`}
                            className={`rounded-full px-4 py-2 font-mono text-xs border transition-colors ${
                                filter === t.key
                                    ? "border-accent-gold/40 bg-accent-gold/10 text-accent-gold"
                                    : "border-white/10 text-text-secondary hover:text-text-primary"
                            }`}
                        >
                            {t.label}
                            <span className="ml-1.5 opacity-60">{t.count}</span>
                        </Link>
                    ))}
                </div>

                {list.length === 0 ? (
                    <div className="mt-12 glass-panel rounded-2xl border border-white/5 p-12 text-center">
                        <p className="font-heading font-bold text-text-primary">
                            No {filter} events listed
                        </p>
                        <p className="font-mono text-xs text-text-secondary mt-2">
                            Check back soon — the board posts new dates here.
                        </p>
                    </div>
                ) : (
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {list.map((event: any) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
