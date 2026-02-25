"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function createAnnouncement(formData: FormData) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const { data, error } = await supabase
        .from("announcements")
        .insert([{
            title: formData.get("title") as string,
            content: formData.get("content") as string,
            tag: formData.get("tag") as string || "general",
            visibility: formData.get("visibility") as string || "public",
            is_pinned: formData.get("is_pinned") === "true",
            author_id: userId,
        }])
        .select().single();

    if (error) return { error: error.message };
    revalidatePath("/announcements");
    revalidatePath("/hub");
    return { success: true, data };
}

export async function deleteAnnouncement(id: string) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/announcements");
    revalidatePath("/hub");
    return { success: true };
}

export async function toggleAnnouncementPin(id: string, currentPin: boolean) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };
    const { error } = await supabase.from("announcements").update({ is_pinned: !currentPin }).eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/announcements");
    return { success: true };
}

export async function createEvent(formData: FormData) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const title = formData.get("title") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const is_public = formData.get("isPublic") === "on";

    const { data, error } = await supabase
        .from("events")
        .insert([{ title, date, location, description, is_public }])
        .select();

    if (error) return { error: error.message };
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, data };
}

export async function toggleRSVP(event_id: string, currentStatus: string | null) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const newStatus = currentStatus === "attending" ? "apologies" : "attending";

    const { data, error } = await supabase
        .from("event_rsvps")
        .upsert({
            event_id,
            member_id: userId,
            status: newStatus
        }, { onConflict: "event_id,member_id" })
        .select();

    if (error) return { error: error.message };
    revalidatePath("/hub");
    return { success: true, data };
}

export async function createInitiative(formData: FormData) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const slug = (formData.get("title") as string)
        .toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const { data, error } = await supabase
        .from("initiatives")
        .insert([{
            slug,
            title: formData.get("title") as string,
            category: formData.get("category") as string,
            short_description: formData.get("short_description") as string,
            full_description: formData.get("full_description") as string,
            impact_stat: formData.get("impact_stat") as string,
            impact_label: formData.get("impact_label") as string,
            hero_image_url: formData.get("hero_image_url") as string,
            color_class: formData.get("color_class") as string || "border-white/10",
        }])
        .select().single();

    if (error) return { error: error.message };
    revalidatePath("/");
    revalidatePath("/initiatives");
    return { success: true, data };
}

export async function deleteInitiative(id: string) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const { error } = await supabase.from("initiatives").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/");
    revalidatePath("/initiatives");
    return { success: true };
}

export async function submitPulseResponse(formData: FormData) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const form_id = formData.get("form_id") as string;
    const answers = JSON.parse(formData.get("answers") as string || "{}");
    const comment = formData.get("comment") as string;

    const { data, error } = await supabase
        .from("pulse_responses")
        .insert([{ form_id, member_id: userId, answers, comment }])
        .select().single();

    if (error) return { error: error.message };
    revalidatePath("/hub");
    return { success: true, data };
}

export async function createPulseForm(formData: FormData) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    // Deactivate current active form first
    await supabase.from("pulse_forms").update({ is_active: false }).eq("is_active", true);

    const { data, error } = await supabase
        .from("pulse_forms")
        .insert([{
            week_label: formData.get("week_label") as string,
            questions: JSON.parse(formData.get("questions") as string || "[]"),
            is_active: true,
        }])
        .select().single();

    if (error) return { error: error.message };
    revalidatePath("/hub");
    return { success: true, data };
}

export async function createBoardMember(formData: FormData) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const { error } = await supabase.from("board_members").insert([{
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        email: formData.get("email") as string,
        image_url: formData.get("image_url") as string,
    }]);

    if (error) return { error: error.message };
    revalidatePath("/about");
    return { success: true };
}

export async function deleteBoardMember(id: string) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };
    const { error } = await supabase.from("board_members").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/about");
    return { success: true };
}

export async function updatePageSection(sectionKey: string, content: Record<string, unknown>) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const { error } = await supabase.from("page_sections")
        .upsert({ section_key: sectionKey, content, updated_by: userId, updated_at: new Date().toISOString() },
            { onConflict: "section_key" });

    if (error) return { error: error.message };
    revalidatePath("/");
    revalidatePath("/about");
    return { success: true };
}

export async function submitFeedback(formData: FormData) {
    const { userId } = await auth();
    const content = formData.get("content") as string;
    const category = formData.get("category") as string || "General";
    const type = formData.get("type") as string || "suggestion";
    const isAnonymous = formData.get("isAnonymous") === "on";

    const { data, error } = await supabase
        .from("feedback")
        .insert([{
            content,
            category,
            type,
            member_id: isAnonymous ? null : userId,
            is_anonymous: isAnonymous
        }])
        .select();

    if (error) return { error: error.message };
    revalidatePath("/hub");
    return { success: true, data };
}
