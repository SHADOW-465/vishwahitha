"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function createBroadcast(formData: FormData) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const isUrgent = formData.get("isUrgent") === "on";

    const { data, error } = await supabase
        .from("announcements")
        .insert([{
            title: isUrgent ? `[URGENT] ${title}` : title,
            content,
            author_id: userId
        }])
        .select();

    if (error) return { error: error.message };
    revalidatePath("/hub");
    return { success: true, data };
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
