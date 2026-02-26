import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { syncUserToSupabase } from "@/lib/sync-user";
import { getAllAnnouncements } from "@/lib/actions";
import { HubTabs } from "@/components/hub-tabs";

export default async function HubPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    await syncUserToSupabase();

    const [
        announcements,
        { data: members },
        { data: documents },
        { data: myRsvps },
        { data: activeForms },
        { data: myResponses },
    ] = await Promise.all([
        getAllAnnouncements(),
        supabase.from("users").select("id, first_name, last_name, email").order("first_name"),
        supabase.from("documents").select("*").order("created_at", { ascending: false }),
        supabase.from("event_rsvps").select("*, events(title, date, location)").eq("member_id", userId),
        supabase.from("pulse_forms").select("*").eq("is_active", true).limit(1),
        supabase.from("pulse_responses").select("id, form_id").eq("member_id", userId),
    ]);

    const activePulseForm = activeForms?.[0] ?? null;
    const myResponseFormIds = (myResponses ?? []).map((r: any) => r.form_id);
    const hasSubmittedPulse = activePulseForm
        ? myResponseFormIds.includes(activePulseForm.id)
        : false;

    const mappedMembers = (members ?? []).map((m: any) => ({
        id: m.id,
        name: `${m.first_name || ""} ${m.last_name || ""}`.trim() || m.email?.split("@")[0],
        role: "Member",
        contact: m.email,
    }));

    return (
        <div className="min-h-screen pt-24 pb-16 px-5 md:pt-32 md:pb-24 md:px-6 max-w-7xl mx-auto">
            <div className="mb-12">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold mb-3">Members Only</p>
                <h1 className="font-heading text-4xl md:text-6xl font-bold text-text-primary leading-tight">
                    Member <span className="font-drama italic gold-text font-light">Hub</span>
                </h1>
                <p className="font-mono text-text-secondary mt-3 max-w-xl">
                    Your club command centre. Announcements, events, documents, and the weekly pulse.
                </p>
            </div>

            <HubTabs
                announcements={announcements}
                members={mappedMembers}
                documents={documents ?? []}
                myRsvps={myRsvps ?? []}
                activePulseForm={activePulseForm}
                hasSubmittedPulse={hasSubmittedPulse}
            />
        </div>
    );
}
