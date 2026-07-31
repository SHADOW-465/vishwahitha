import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { getPublicEvents } from "@/lib/actions";

function parts(value: string | null | undefined) {
    if (!value) return null;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return null;
    return {
        day: d.toLocaleDateString("en-IN", { day: "2-digit" }),
        month: d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
        year: d.toLocaleDateString("en-IN", { year: "numeric" }),
        weekday: d.toLocaleDateString("en-IN", { weekday: "long" }),
        iso: d.toISOString(),
    };
}

/**
 * Act II · the diary.
 *
 * Not a row of cards — one continuous ledger surface split by hairlines, so
 * the dates read as a run of entries rather than six repeated boxes. Scrolls
 * with native scroll-snap; no JS, no carousel library.
 */
export async function EventsCarousel() {
    const events = await getPublicEvents(8);
    const now = Date.now();
    const upcoming = (events || []).filter(
        (e: { date?: string }) => e.date && new Date(e.date).getTime() >= now
    );
    const display = upcoming.length > 0 ? upcoming.slice(0, 6) : [];

    return (
        <div id="events-preview" className="w-full">
            <div className="max-w-7xl mx-auto px-6">
                <div
                    className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-act-beat"
                    data-reveal
                >
                    <h2 className="font-heading font-extrabold text-step-3 text-text-primary tracking-tight max-w-xl">
                        What the club is doing{" "}
                        <span className="font-display-drama text-gold-ink">next</span>
                    </h2>
                    <Link
                        href="/events"
                        className="inline-flex items-center gap-1.5 text-step--1 text-gold-ink hover:text-accent-gold-light transition-colors shrink-0"
                    >
                        Full calendar <ArrowRight size={13} />
                    </Link>
                </div>
            </div>

            {display.length === 0 ? (
                <div className="max-w-7xl mx-auto px-6" data-reveal>
                    <div className="border-y border-white/10 py-16 text-center">
                        <CalendarDays className="mx-auto text-accent-gold/50 mb-4" size={24} />
                        <p className="font-heading font-bold text-step-1 text-text-primary">
                            Nothing on the calendar right now
                        </p>
                        <p className="text-step--1 text-text-secondary mt-2 max-w-sm mx-auto">
                            The board posts service days, meetings, and fellowship as they&apos;re
                            confirmed. Past sessions stay in the calendar.
                        </p>
                        <Link
                            href="/events"
                            className="inline-flex mt-6 text-step--1 text-gold-ink border border-accent-gold/25 rounded-full px-5 py-2.5 hover:bg-accent-gold/10 transition-colors"
                        >
                            View full calendar
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    {/* Full-bleed ledger: entries continue past the viewport edge,
                        which is what signals "there is more" without a control. */}
                    <div className="border-y border-white/10" data-reveal>
                        <ol className="rail-scroll flex overflow-x-auto snap-x snap-mandatory">
                            {display.map((event: {
                                id: string;
                                title: string;
                                date?: string;
                                location?: string;
                                is_online?: boolean;
                            }, i: number) => {
                                const p = parts(event.date);
                                return (
                                    <li
                                        key={event.id}
                                        className="snap-start shrink-0 w-[78vw] sm:w-[46vw] lg:w-[30vw] xl:w-[24rem] border-r border-white/10 last:border-r-0"
                                    >
                                        <Link
                                            href={`/events/${event.id}`}
                                            className="group flex h-full flex-col justify-between gap-10 p-7 sm:p-9 min-h-[19rem] transition-colors duration-500 hover:bg-white/[0.035]"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    {p ? (
                                                        <time dateTime={p.iso} className="block">
                                                            <span className="block font-heading font-extrabold text-step-4 leading-none text-text-primary tabular-nums">
                                                                {p.day}
                                                            </span>
                                                            <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.28em] text-gold-ink">
                                                                {p.month} {p.year}
                                                            </span>
                                                        </time>
                                                    ) : (
                                                        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-secondary">
                                                            Date to be announced
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary tabular-nums pt-1">
                                                    {String(i + 1).padStart(2, "0")}
                                                </span>
                                            </div>

                                            <div>
                                                <h3 className="font-heading font-bold text-step-1 text-text-primary leading-snug group-hover:text-gold-ink transition-colors duration-300">
                                                    {event.title}
                                                </h3>
                                                <p className="mt-3 text-step--1 text-text-secondary">
                                                    {p?.weekday ?? "Date TBA"}
                                                    {event.is_online ? " · Online" : ""}
                                                    {event.location ? ` · ${event.location}` : ""}
                                                </p>
                                                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary group-hover:text-text-primary transition-colors">
                                                    Details
                                                    <ArrowRight
                                                        size={11}
                                                        className="group-hover:translate-x-1 transition-transform duration-300"
                                                    />
                                                </span>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                    <div className="max-w-7xl mx-auto px-6">
                        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                            {display.length} upcoming · scroll for more
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
