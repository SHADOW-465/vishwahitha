import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getPublicEventsCatalog } from "@/lib/actions";
import { EventRsvpButton } from "@/components/event-rsvp-button";

export default async function MemberEventsPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const [{ upcoming }, { data: myRsvps }] = await Promise.all([
        getPublicEventsCatalog(),
        supabase
            .from("event_rsvps")
            .select("event_id, status, events(title, date, location)")
            .eq("member_id", userId),
    ]);

    const rsvpByEvent = new Map(
        (myRsvps ?? []).map((r: any) => [r.event_id, r.status])
    );

    return (
        <div className="space-y-10">
            <section>
                <h2 className="font-heading font-bold text-2xl text-text-primary">
                    Upcoming · RSVP
                </h2>
                <p className="font-mono text-xs text-text-secondary mt-1">
                    One-click presence for club events.
                </p>
                {upcoming.length === 0 ? (
                    <p className="mt-6 font-mono text-sm text-text-secondary glass-panel rounded-2xl p-8 text-center">
                        No upcoming events.{" "}
                        <Link href="/events" className="text-accent-gold">
                            Public calendar
                        </Link>
                    </p>
                ) : (
                    <ul className="mt-6 space-y-4">
                        {upcoming.map((event: any) => (
                            <li
                                key={event.id}
                                className="glass-panel rounded-2xl border border-white/5 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                            >
                                <div className="min-w-0">
                                    <Link
                                        href={`/events/${event.id}`}
                                        className="font-heading font-bold text-text-primary hover:text-accent-gold"
                                    >
                                        {event.title}
                                    </Link>
                                    <p className="font-mono text-xs text-text-secondary mt-1">
                                        {event.date
                                            ? new Date(event.date).toLocaleString("en-IN", {
                                                  weekday: "short",
                                                  day: "numeric",
                                                  month: "short",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })
                                            : "TBA"}
                                        {event.location ? ` · ${event.location}` : ""}
                                    </p>
                                </div>
                                <EventRsvpButton
                                    eventId={event.id}
                                    initialStatus={rsvpByEvent.get(event.id) ?? null}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h2 className="font-heading font-bold text-xl text-text-primary">Your RSVPs</h2>
                {(myRsvps ?? []).length === 0 ? (
                    <p className="mt-4 font-mono text-sm text-text-secondary">
                        You haven&apos;t RSVP&apos;d yet.
                    </p>
                ) : (
                    <ul className="mt-4 space-y-3">
                        {(myRsvps ?? []).map((r: any) => (
                            <li
                                key={r.event_id}
                                className="flex justify-between gap-3 border-b border-white/5 pb-3 font-mono text-sm"
                            >
                                <span className="text-text-primary truncate">
                                    {r.events?.title || "Event"}
                                </span>
                                <span className="text-text-secondary shrink-0">{r.status}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
