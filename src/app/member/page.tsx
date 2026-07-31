import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getPublicEvents, getPublicAnnouncements } from "@/lib/actions";
import { EventRsvpButton } from "@/components/event-rsvp-button";

export default async function MemberHomePage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const [
        events,
        announcements,
        { data: activeForms },
        { data: myResponses },
        { data: topIdeas },
        { data: me },
        { data: myRsvp },
    ] = await Promise.all([
        getPublicEvents(10),
        getPublicAnnouncements(),
        supabase.from("pulse_forms").select("*").eq("is_active", true).limit(1),
        supabase.from("pulse_responses").select("id, form_id").eq("member_id", userId),
        supabase
            .from("ideas")
            .select("id, title, status, vote_count")
            .order("vote_count", { ascending: false })
            .limit(3),
        supabase
            .from("users")
            .select("tutorial_completed_at, first_name")
            .eq("id", userId)
            .maybeSingle(),
        supabase.from("event_rsvps").select("event_id, status").eq("member_id", userId),
    ]);

    const now = Date.now();
    const upcoming = (events || []).filter(
        (e: { date?: string }) => e.date && new Date(e.date).getTime() >= now
    );
    const nextEvent = upcoming[0] ?? null;
    const activePulse = activeForms?.[0] ?? null;
    const hasSubmittedPulse = activePulse
        ? (myResponses ?? []).some((r: { form_id: string }) => r.form_id === activePulse.id)
        : false;
    const rsvpMap = new Map(
        (myRsvp ?? []).map((r: { event_id: string; status: string }) => [r.event_id, r.status])
    );
    const nextRsvp = nextEvent ? rsvpMap.get(nextEvent.id) ?? null : null;
    const pinned = (announcements || []).find((a: { is_pinned?: boolean }) => a.is_pinned);
    const tutorialDone = Boolean(me?.tutorial_completed_at);

    return (
        <div className="space-y-8">
            {!tutorialDone && (
                <div className="rounded-2xl border border-accent-gold/30 bg-accent-gold/5 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-wider text-accent-gold">
                            New member
                        </p>
                        <p className="font-heading font-bold text-text-primary mt-1">
                            Finish the short Rotaract intro
                        </p>
                        <p className="font-mono text-xs text-text-secondary mt-1">
                            What Rotaract is, how this club works, and your first action.
                        </p>
                    </div>
                    <Link
                        href="/member/learn"
                        className="shrink-0 rounded-full bg-accent-cranberry text-text-primary font-bold text-sm px-5 py-2.5 hover:bg-[#e01872] transition-colors"
                    >
                        Open Learn
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Next event */}
                <section className="lg:col-span-7 glass-panel rounded-[1.75rem] border border-white/5 p-6 min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-cranberry">
                        Next event
                    </p>
                    {nextEvent ? (
                        <>
                            <h2 className="mt-2 font-heading font-extrabold text-2xl text-text-primary text-balance">
                                {nextEvent.title}
                            </h2>
                            <p className="mt-2 font-mono text-xs text-text-secondary">
                                {new Date(nextEvent.date).toLocaleString("en-IN", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                                {nextEvent.location ? ` · ${nextEvent.location}` : ""}
                            </p>
                            <div className="mt-5 flex flex-wrap gap-3">
                                <EventRsvpButton
                                    eventId={nextEvent.id}
                                    initialStatus={nextRsvp}
                                />
                                <Link
                                    href={`/events/${nextEvent.id}`}
                                    className="font-mono text-xs text-text-secondary hover:text-accent-gold self-center"
                                >
                                    Details
                                </Link>
                            </div>
                        </>
                    ) : (
                        <p className="mt-3 font-mono text-sm text-text-secondary">
                            No upcoming public events. Check{" "}
                            <Link href="/member/events" className="text-accent-gold">
                                Events
                            </Link>
                            .
                        </p>
                    )}
                </section>

                {/* Weekly prompt */}
                <section className="lg:col-span-5 glass-panel rounded-[1.75rem] border border-white/5 p-6 min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-gold">
                        This week&apos;s prompt
                    </p>
                    {activePulse ? (
                        <>
                            <h2 className="mt-2 font-heading font-bold text-xl text-text-primary">
                                {activePulse.week_label}
                            </h2>
                            <p className="mt-2 font-mono text-xs text-text-secondary">
                                {hasSubmittedPulse
                                    ? "You already answered this week."
                                    : "Not answered yet — takes a minute."}
                            </p>
                            <Link
                                href="/member/participate"
                                className="inline-flex mt-5 rounded-full border border-white/15 px-4 py-2 font-mono text-xs text-text-primary hover:border-accent-gold/40"
                            >
                                {hasSubmittedPulse ? "View Participate" : "Answer prompt"}
                            </Link>
                        </>
                    ) : (
                        <p className="mt-3 font-mono text-sm text-text-secondary">
                            No active prompt. The board posts one each week.
                        </p>
                    )}
                </section>
            </div>

            {/* Top ideas */}
            <section className="glass-panel rounded-[1.75rem] border border-white/5 p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-gold">
                        Top ideas
                    </p>
                    <Link
                        href="/member/participate"
                        className="font-mono text-xs text-accent-gold hover:underline"
                    >
                        Idea board →
                    </Link>
                </div>
                {(topIdeas ?? []).length === 0 ? (
                    <p className="font-mono text-sm text-text-secondary">
                        No ideas yet — post the first one in Participate.
                    </p>
                ) : (
                    <ul className="space-y-3">
                        {(topIdeas ?? []).map(
                            (idea: {
                                id: string;
                                title: string;
                                status: string;
                                vote_count: number;
                            }) => (
                                <li
                                    key={idea.id}
                                    className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-0"
                                >
                                    <div className="min-w-0">
                                        <p className="font-heading font-bold text-text-primary truncate">
                                            {idea.title}
                                        </p>
                                        <p className="font-mono text-[10px] text-text-secondary">
                                            {idea.status.replace("_", " ")} · {idea.vote_count} votes
                                        </p>
                                    </div>
                                </li>
                            )
                        )}
                    </ul>
                )}
            </section>

            {/* Pinned announcement */}
            {pinned && (
                <section className="rounded-2xl border border-accent-cranberry/25 bg-accent-cranberry/[0.04] p-5">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-accent-cranberry">
                        Pinned notice
                    </p>
                    <h2 className="mt-1 font-heading font-bold text-lg text-text-primary">
                        {pinned.title}
                    </h2>
                    <p className="mt-2 font-mono text-xs text-text-secondary line-clamp-3 leading-relaxed">
                        {pinned.content}
                    </p>
                </section>
            )}
        </div>
    );
}
