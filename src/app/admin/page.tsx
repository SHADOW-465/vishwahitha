import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { syncUserToSupabase } from "@/lib/sync-user";
import { getAllAnnouncements } from "@/lib/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { AnnouncementManager } from "@/components/admin/announcement-manager";
import { InitiativeManager } from "@/components/admin/initiative-manager";
import { PulseFormBuilder } from "@/components/admin/pulse-form-builder";
import { EventManager } from "@/components/event-manager";
import { BroadcastCenter } from "@/components/broadcast-center";
import { WeeklyPulseAggregator } from "@/components/weekly-pulse-aggregator";

export default async function AdminPage() {
    const { userId } = await auth();
    if (!userId) redirect("/");

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    if (user.publicMetadata?.role !== "admin") redirect("/");

    await syncUserToSupabase();

    const [
        announcements,
        { data: members },
        { data: events },
        { data: pulseResponses },
        { data: feedback },
        { data: initiatives },
    ] = await Promise.all([
        getAllAnnouncements(),
        supabase.from("users").select("id"),
        supabase.from("events").select("id"),
        supabase.from("pulse_responses").select("id"),
        supabase.from("feedback").select("*").order("created_at", { ascending: false }),
        supabase.from("initiatives").select("*").order("display_order"),
    ]);

    const stats = {
        members: members?.length ?? 0,
        events: events?.length ?? 0,
        announcements: announcements.length,
        pulseResponses: pulseResponses?.length ?? 0,
    };

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
            <div className="mb-12">
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-primary">
                    Board <span className="font-drama italic gold-text font-light">Command</span>
                </h1>
                <p className="font-mono text-text-secondary mt-3">Full CMS access. You can manage all site content from here.</p>
            </div>

            <AdminShell
                stats={stats}
                panels={{
                    announcements: <AnnouncementManager announcements={announcements} />,
                    initiatives: <InitiativeManager initiatives={initiatives ?? []} />,
                    events: <EventManager />,
                    pulse: <PulseFormBuilder />,
                    broadcast: <BroadcastCenter />,
                }}
            />
        </div>
    );
}
