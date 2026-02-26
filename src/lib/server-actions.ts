"use server";

import { supabase } from "@/lib/supabase";
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
    });

    const { data, error } = await supabase
        .from("events")
        .insert([payload])
        .select();

    if (error) return { success: false, message: error.message, error };
    revalidatePath("/");
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
    return { success: true, message: "RSVP updated successfully", data };
}

export async function createInitiative(formData: FormData): Promise<ActionResponse> {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Unauthorized" };

    const title = formData.get("title") as string;
    const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

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
    return { success: true, message: "Pulse response submitted successfully", data };
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
    return { success: true, message: "Page section updated successfully" };
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
