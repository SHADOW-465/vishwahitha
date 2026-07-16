"use server";

import { supabaseAdmin as supabase } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export type ActionResponse<T = any> = {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
};

// Helper to sanitize payload for Supabase partial updates
function sanitizePayload(payload: Record<string, any>) {
    const cleaned = {} as Record<string, any>;
    for (const [key, value] of Object.entries(payload)) {
        if (value === undefined) continue;

        // Safely pass null for empty optional URL fields or strings
        if (typeof value === "string" && value.trim() === "") {
            if (key.includes("url") || key.includes("image") || key === "impact_stat" || key === "impact_label" || key === "email") {
                cleaned[key] = null;
                continue;
            }
        }
        cleaned[key] = value;
    }
    return cleaned;
}

export async function createAnnouncement(formData: FormData): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const payload = sanitizePayload({
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        tag: (formData.get("tag") as string) || "general",
        visibility: (formData.get("visibility") as string) || "public",
        is_pinned: formData.get("is_pinned") === "true",
        author_id: userId,
    });

    const { data, error } = await supabase
        .from("announcements")
        .insert([payload])
        .select().single();

    if (error) return { success: false, message: error.message, error };
    revalidatePath("/announcements");
    revalidatePath("/hub");
    return { success: true, message: "Announcement created successfully", data };
}

export async function deleteAnnouncement(id: string): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) return { success: false, message: error.message, error };
    revalidatePath("/announcements");
    revalidatePath("/hub");
    return { success: true, message: "Announcement deleted successfully" };
}

export async function toggleAnnouncementPin(id: string, currentPin: boolean): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };
    const { error } = await supabase.from("announcements").update({ is_pinned: !currentPin }).eq("id", id);
    if (error) return { success: false, message: error.message, error };
    revalidatePath("/announcements");
    return { success: true, message: currentPin ? "Announcement unpinned" : "Announcement pinned" };
}

export async function createEvent(formData: FormData): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const payload = sanitizePayload({
        title: formData.get("title") as string,
        date: formData.get("date") as string,
        location: formData.get("location") as string,
        description: formData.get("description") as string,
        is_public: formData.get("isPublic") === "on",
        is_online: formData.get("isOnline") === "on",
        created_by: userId,
    });

    const { data, error } = await supabase
        .from("events")
        .insert([payload])
        .select();

    if (error) return { success: false, message: error.message, error };
    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/admin");
    return { success: true, message: "Event created successfully", data };
}

export async function toggleRSVP(event_id: string, currentStatus: string | null): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const newStatus = currentStatus === "attending" ? "apologies" : "attending";

    const { data, error } = await supabase
        .from("event_rsvps")
        .upsert({
            event_id,
            member_id: userId,
            status: newStatus
        }, { onConflict: "event_id,member_id" })
        .select();

    if (error) return { success: false, message: error.message, error };
    revalidatePath("/hub");
    revalidatePath("/member");
    revalidatePath("/member/events");
    revalidatePath("/events");
    revalidatePath(`/events/${event_id}`);
    return { success: true, message: "RSVP updated successfully", data };
}

export async function createInitiative(formData: FormData): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const title = formData.get("title") as string;
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const isLegacy = formData.get("is_legacy") === "on" || formData.get("is_legacy") === "true";

    if (isLegacy) {
        await supabase.from("initiatives").update({ is_legacy: false }).eq("is_legacy", true);
    }

    const payload = sanitizePayload({
        slug,
        title,
        category: formData.get("category") as string,
        short_description: formData.get("short_description") as string,
        full_description: formData.get("full_description") as string,
        impact_stat: formData.get("impact_stat") as string,
        impact_label: formData.get("impact_label") as string,
        hero_image_url: formData.get("hero_image_url") as string,
        color_class: (formData.get("color_class") as string) || "border-white/10",
        is_featured: formData.get("is_featured") !== "off",
        is_legacy: isLegacy,
    });

    const message = !payload.hero_image_url ? "Initiative created without hero image" : "Initiative created successfully";

    const { data, error } = await supabase
        .from("initiatives")
        .insert([payload])
        .select().single();

    if (error) return { success: false, message: error.message, error };
    revalidatePath("/");
    revalidatePath("/initiatives");
    return { success: true, message, data };
}

/** Enforce exactly one legacy project */
export async function setInitiativeLegacy(id: string): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    await supabase.from("initiatives").update({ is_legacy: false }).eq("is_legacy", true);
    const { error } = await supabase.from("initiatives").update({ is_legacy: true, is_featured: true }).eq("id", id);
    if (error) return { success: false, message: error.message, error };
    revalidatePath("/");
    revalidatePath("/initiatives");
    revalidatePath("/admin");
    return { success: true, message: "Legacy flagship updated (only one allowed)." };
}

export async function deleteInitiative(id: string): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const { error } = await supabase.from("initiatives").delete().eq("id", id);
    if (error) return { success: false, message: error.message, error };
    revalidatePath("/");
    revalidatePath("/initiatives");
    return { success: true, message: "Initiative deleted successfully" };
}

export async function submitPulseResponse(formData: FormData): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const form_id = formData.get("form_id") as string;
    const answers = JSON.parse((formData.get("answers") as string) || "{}");
    const comment = formData.get("comment") as string;

    const payload = sanitizePayload({ form_id, member_id: userId, answers, comment });

    const { data, error } = await supabase
        .from("pulse_responses")
        .insert([payload])
        .select().single();

    if (error) return { success: false, message: error.message, error };
    revalidatePath("/hub");
    revalidatePath("/member");
    revalidatePath("/member/participate");
    return { success: true, message: "Pulse response submitted successfully", data };
}

export async function createIdea(formData: FormData): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const title = String(formData.get("title") || "").trim();
    const body = String(formData.get("body") || "").trim();
    if (!title || !body) return { success: false, message: "Title and details are required." };

    const { data, error } = await supabase
        .from("ideas")
        .insert([{ author_id: userId, title, body, status: "new", vote_count: 0 }])
        .select()
        .single();

    if (error) return { success: false, message: error.message, error };
    revalidatePath("/member");
    revalidatePath("/member/participate");
    return { success: true, message: "Idea posted.", data };
}

export async function voteIdea(ideaId: string): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const { error: voteErr } = await supabase
        .from("idea_votes")
        .insert([{ idea_id: ideaId, member_id: userId }]);

    if (voteErr) {
        if (voteErr.code === "23505") {
            return { success: false, message: "You already voted for this idea." };
        }
        return { success: false, message: voteErr.message, error: voteErr };
    }

    const { data: idea } = await supabase.from("ideas").select("vote_count").eq("id", ideaId).single();
    const next = (idea?.vote_count ?? 0) + 1;
    await supabase.from("ideas").update({ vote_count: next }).eq("id", ideaId);

    revalidatePath("/member");
    revalidatePath("/member/participate");
    return { success: true, message: "Vote recorded." };
}

export async function completeTutorial(): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const { error } = await supabase
        .from("users")
        .update({ tutorial_completed_at: new Date().toISOString() })
        .eq("id", userId);

    if (error) return { success: false, message: error.message, error };
    revalidatePath("/member");
    revalidatePath("/member/learn");
    return { success: true, message: "Tutorial complete. Welcome in." };
}

export async function updateIdeaStatus(ideaId: string, status: string): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const allowed = ["new", "under_review", "planned", "done", "declined"];
    if (!allowed.includes(status)) return { success: false, message: "Invalid status." };

    const { error } = await supabase.from("ideas").update({ status }).eq("id", ideaId);
    if (error) return { success: false, message: error.message, error };
    revalidatePath("/member/participate");
    revalidatePath("/admin");
    return { success: true, message: `Idea marked ${status}.` };
}

export async function createMilestone(formData: FormData): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const payload = sanitizePayload({
        year: formData.get("year") as string,
        title: formData.get("title") as string,
        body: formData.get("body") as string,
        display_order: Number(formData.get("display_order") || 0),
    });

    const { data, error } = await supabase.from("milestones").insert([payload]).select().single();
    if (error) return { success: false, message: error.message, error };
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Milestone added.", data };
}

export async function deleteMilestone(id: string): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };
    const { error } = await supabase.from("milestones").delete().eq("id", id);
    if (error) return { success: false, message: error.message, error };
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Milestone deleted." };
}

export async function deleteContactMessage(id: string): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return { success: false, message: error.message, error };
    revalidatePath("/admin");
    return { success: true, message: "Message removed." };
}

export async function addIdeaComment(formData: FormData): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const idea_id = String(formData.get("idea_id") || "");
    const body = String(formData.get("body") || "").trim();
    if (!idea_id || !body) return { success: false, message: "Comment required." };

    const { data, error } = await supabase
        .from("idea_comments")
        .insert([{ idea_id, author_id: userId, body }])
        .select()
        .single();

    if (error) return { success: false, message: error.message, error };
    revalidatePath("/member/participate");
    return { success: true, message: "Comment added.", data };
}

/** Phase 4: email all members a weekly digest of upcoming events + active prompt */
export async function sendWeeklyDigest(): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const { sendMemberEmails } = await import("@/lib/email");
    const now = new Date();
    const inTwoWeeks = new Date(now.getTime() + 14 * 86400000).toISOString();

    const [{ data: members }, { data: events }, { data: forms }] = await Promise.all([
        supabase.from("users").select("email, first_name"),
        supabase
            .from("events")
            .select("title, date, location, is_public")
            .eq("is_public", true)
            .gte("date", now.toISOString())
            .lte("date", inTwoWeeks)
            .order("date", { ascending: true })
            .limit(8),
        supabase.from("pulse_forms").select("week_label").eq("is_active", true).limit(1),
    ]);

    const eventLines =
        (events ?? []).length > 0
            ? (events ?? [])
                  .map(
                      (e: any) =>
                          `• ${e.title} — ${new Date(e.date).toLocaleString("en-IN", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                          })}${e.location ? ` @ ${e.location}` : ""}`
                  )
                  .join("\n")
            : "• No public events scheduled in the next two weeks.";

    const promptLine = forms?.[0]
        ? `\nThis week's prompt: ${forms[0].week_label}\nAnswer it in Member → Participate.\n`
        : "\n";

    const text = `Weekly club digest\n\nUpcoming:\n${eventLines}\n${promptLine}\nOpen the site: sign in → Member for RSVP, ideas, and the tutorial.`;

    const result = await sendMemberEmails({
        subject: "Vishwahita weekly digest",
        text,
        recipients: members ?? [],
    });

    return {
        success: true,
        message: result.message,
        data: { sent: result.sent, errors: result.errors },
    };
}

/** Phase 4: remind members about events in the next 48 hours */
export async function sendEventReminders(): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const { sendMemberEmails } = await import("@/lib/email");
    const now = new Date();
    const in48h = new Date(now.getTime() + 48 * 3600000).toISOString();

    const [{ data: members }, { data: events }] = await Promise.all([
        supabase.from("users").select("email, first_name"),
        supabase
            .from("events")
            .select("title, date, location, is_public")
            .eq("is_public", true)
            .gte("date", now.toISOString())
            .lte("date", in48h)
            .order("date", { ascending: true }),
    ]);

    if (!events?.length) {
        return { success: true, message: "No events in the next 48 hours — nothing to send." };
    }

    const lines = events
        .map(
            (e: any) =>
                `• ${e.title} — ${new Date(e.date).toLocaleString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                })}${e.location ? ` @ ${e.location}` : ""}`
        )
        .join("\n");

    const result = await sendMemberEmails({
        subject: "Reminder: Vishwahita events soon",
        text: `Friendly reminder — these events are coming up soon:\n\n${lines}\n\nRSVP under Member → Events if you can make it.`,
        recipients: members ?? [],
    });

    return {
        success: true,
        message: result.message,
        data: { sent: result.sent, errors: result.errors },
    };
}

export async function createPulseForm(formData: FormData): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    // Deactivate current active form first
    await supabase.from("pulse_forms").update({ is_active: false }).eq("is_active", true);

    const payload = sanitizePayload({
        week_label: formData.get("week_label") as string,
        questions: JSON.parse((formData.get("questions") as string) || "[]"),
        is_active: true,
    });

    const { data, error } = await supabase
        .from("pulse_forms")
        .insert([payload])
        .select().single();

    if (error) return { success: false, message: error.message, error };
    revalidatePath("/hub");
    return { success: true, message: "Pulse form created successfully", data };
}

export async function createBoardMember(formData: FormData): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const payload = sanitizePayload({
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        email: formData.get("email") as string,
        image_url: formData.get("image_url") as string,
    });

    const message = !payload.image_url ? "Member added without image" : "Board member added successfully";

    const { error } = await supabase.from("board_members").insert([payload]);

    if (error) return { success: false, message: error.message, error };
    revalidatePath("/about");
    return { success: true, message };
}

export async function deleteBoardMember(id: string): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };
    const { error } = await supabase.from("board_members").delete().eq("id", id);
    if (error) return { success: false, message: error.message, error };
    revalidatePath("/about");
    return { success: true, message: "Board member deleted successfully" };
}

export async function updatePageSection(sectionKey: string, content: Record<string, unknown>): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const { error } = await supabase.from("page_sections")
        .upsert({ section_key: sectionKey, content, updated_by: userId, updated_at: new Date().toISOString() },
            { onConflict: "section_key" });

    if (error) return { success: false, message: error.message, error };
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/admin");
    return { success: true, message: "Page section updated successfully" };
}

/** Public contact / membership prospect form (no auth required) */
export async function submitContactMessage(formData: FormData): Promise<ActionResponse> {
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const age = String(formData.get("age") || "").trim();
    const occupation = String(formData.get("occupation") || "").trim();
    const kind = (formData.get("kind") as string) === "prospect" ? "prospect" : "contact";

    if (!name || !email || !message) {
        return { success: false, message: "Name, email, and message are required." };
    }

    const payload = sanitizePayload({
        name,
        email,
        phone: phone || null,
        age: age || null,
        occupation: occupation || null,
        message,
        kind,
    });

    const { data, error } = await supabase
        .from("contact_messages")
        .insert([payload])
        .select()
        .single();

    if (error) {
        // Table may not be migrated yet
        console.error("submitContactMessage:", error);
        return {
            success: false,
            message: error.message.includes("contact_messages")
                ? "Contact inbox is not set up yet. Email contact@vishwahitha.org or the board directly."
                : error.message,
            error,
        };
    }

    revalidatePath("/admin");
    revalidatePath("/contact");
    return {
        success: true,
        message: kind === "prospect"
            ? "Application received. The board will reach out soon."
            : "Message sent. We'll get back to you.",
        data,
    };
}

export async function submitFeedback(formData: FormData): Promise<ActionResponse> {
    const { userId } = await auth();
    const content = formData.get("content") as string;
    const category = (formData.get("category") as string) || "General";
    const type = (formData.get("type") as string) || "suggestion";
    const isAnonymous = formData.get("isAnonymous") === "on";

    const payload = sanitizePayload({
        content,
        category,
        type,
        member_id: isAnonymous ? null : userId,
        is_anonymous: isAnonymous
    });

    const { data, error } = await supabase
        .from("feedback")
        .insert([payload])
        .select();

    if (error) return { success: false, message: error.message, error };
    revalidatePath("/hub");
    return { success: true, message: "Feedback submitted successfully", data };
}
