import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getAllAnnouncements } from "@/lib/actions";
import { HubTabs } from "@/components/hub-tabs";

/** Legacy hub tools: feed, documents, directory, pulse */
export default async function MemberOpsPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

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
        supabase
            .from("event_rsvps")
            .select("*, events(title, date, location)")
            .eq("member_id", userId),
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
        <div>
            <p className="font-mono text-xs text-text-secondary mb-6">
                Feed, documents, directory, and weekly pulse tools.
            </p>
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
