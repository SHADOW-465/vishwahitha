import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getEventById } from "@/lib/actions";
import { supabase } from "@/lib/supabase";
import { EventRsvpButton } from "@/components/event-rsvp-button";

export const revalidate = 60;

function formatDate(value: string | null | undefined) {
    if (!value) return "Date to be announced";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "Date to be announced";
    return d.toLocaleString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default async function EventDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const event = await getEventById(id);
    if (!event) notFound();

    const { userId } = await auth();
    let rsvpStatus: string | null = null;
    if (userId) {
        const { data } = await supabase
            .from("event_rsvps")
            .select("status")
            .eq("event_id", id)
            .eq("member_id", userId)
            .maybeSingle();
        rsvpStatus = data?.status ?? null;
    }

    return (
        <main className="min-h-screen bg-primary pt-28 md:pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                <Link
                    href="/events"
                    className="font-mono text-xs text-text-secondary hover:text-accent-gold transition-colors"
                >
                    ← All events
                </Link>

                <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-cranberry">
                    {event.is_online ? "Online · " : ""}
                    {formatDate(event.date)}
                </p>
                <h1 className="mt-3 font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-primary tracking-tight text-balance">
                    {event.title}
                </h1>
                {event.location && (
                    <p className="mt-3 font-mono text-sm text-text-secondary">@ {event.location}</p>
                )}

                <div className="mt-10 glass-panel rounded-[2rem] border border-white/5 p-6 sm:p-8">
                    <p className="font-mono text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                        {event.description || "Details will be shared by the board closer to the date."}
                    </p>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                    <EventRsvpButton eventId={event.id} initialStatus={rsvpStatus} />
                    <Link
                        href="/sign-up"
                        className="font-mono text-xs text-text-secondary hover:text-accent-gold"
                    >
                        Not a member yet? Join
                    </Link>
                </div>
            </div>
        </main>
    );
}
