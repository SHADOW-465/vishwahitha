import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { syncUserToSupabase } from "@/lib/sync-user";
import { getAllAnnouncements } from "@/lib/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { AnnouncementManager } from "@/components/admin/announcement-manager";
import { InitiativeManager } from "@/components/admin/initiative-manager";
import { PulseFormBuilder } from "@/components/admin/pulse-form-builder";
import { BoardManager } from "@/components/admin/board-manager";
import { PageSectionsEditor } from "@/components/admin/page-sections-editor";
import { IdeasModeration } from "@/components/admin/ideas-moderation";
import { ContactInbox } from "@/components/admin/contact-inbox";
import { MilestoneManager } from "@/components/admin/milestone-manager";
import { PresidentChecklist } from "@/components/admin/president-checklist";
import { HabitsPanel } from "@/components/admin/habits-panel";
import { EventManager } from "@/components/event-manager";
import { BroadcastCenter } from "@/components/broadcast-center";

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
        { data: initiatives },
        { data: boardMembers },
        { data: pageSections },
        { data: ideas },
        { data: contactMessages },
        { data: milestones },
    ] = await Promise.all([
        getAllAnnouncements(),
        supabase.from("users").select("id"),
        supabase.from("events").select("id"),
        supabase.from("pulse_responses").select("id"),
        supabase.from("initiatives").select("*").order("display_order"),
        supabase.from("board_members").select("*").order("display_order"),
        supabase.from("page_sections").select("*"),
        supabase.from("ideas").select("*").order("created_at", { ascending: false }),
        supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
        supabase.from("milestones").select("*").order("display_order"),
    ]);

    const stats = {
        members: members?.length ?? 0,
        events: events?.length ?? 0,
        announcements: announcements.length,
        pulseResponses: pulseResponses?.length ?? 0,
    };

    const sectionsMap = Object.fromEntries(
        (pageSections ?? []).map((s: any) => [s.section_key, s])
    );

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
            <div className="mb-12">
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-primary">
                    Board{" "}
                    <span className="font-display-drama gold-text font-light">Command</span>
                </h1>
                <p className="font-mono text-text-secondary mt-3">
                    Full CMS — events, projects, ideas, inbox, milestones, and page copy.
                </p>
            </div>

            <AdminShell
                stats={stats}
                panels={{
                    checklist: <PresidentChecklist />,
                    announcements: <AnnouncementManager announcements={announcements} />,
                    initiatives: <InitiativeManager initiatives={initiatives ?? []} />,
                    events: <EventManager />,
                    ideas: <IdeasModeration ideas={ideas ?? []} />,
                    inbox: <ContactInbox messages={contactMessages ?? []} />,
                    milestones: <MilestoneManager milestones={milestones ?? []} />,
                    habits: <HabitsPanel />,
                    pulse: <PulseFormBuilder />,
                    board: <BoardManager members={boardMembers ?? []} />,
                    sections: <PageSectionsEditor sections={sectionsMap} />,
                    broadcast: <BroadcastCenter />,
                }}
            />
        </div>
    );
}
