"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createBroadcast(formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const isUrgent = formData.get("isUrgent") === "on";

    const { data, error } = await supabase
        .from("announcements")
        .insert([{
            title: isUrgent ? `[URGENT] ${title}` : title,
            content,
            author_id: "00000000-0000-0000-0000-000000000000" // placeholder for production auth
        }])
        .select();

    if (error) return { error: error.message };
    revalidatePath("/hub");
    return { success: true, data };
}

export async function createEvent(formData: FormData) {
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

export async function toggleRSVP(event_id: string, member_id: string, currentStatus: string | null) {
    const newStatus = currentStatus === "attending" ? "apologies" : "attending";

    const { data, error } = await supabase
        .from("event_rsvps")
        .upsert({
            event_id,
            member_id,
            status: newStatus
        }, { onConflict: "event_id,member_id" })
        .select();

    if (error) return { error: error.message };
    revalidatePath("/hub");
    return { success: true, data };
}

export async function submitFeedback(formData: FormData) {
    const content = formData.get("content") as string;
    const category = formData.get("category") as string || "General";

    const { data, error } = await supabase
        .from("feedback")
        .insert([{
            content,
            category,
            member_id: "00000000-0000-0000-0000-000000000000" // placeholder
        }])
        .select();

    if (error) return { error: error.message };
    revalidatePath("/admin");
    return { success: true, data };
}
