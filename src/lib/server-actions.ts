"use server";

import { supabase } from "@/lib/supabase";

export async function createBroadcast(formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const isUrgent = formData.get("isUrgent") === "on";

    // In a real app, verify admin role here
    const { data, error } = await supabase
        .from("announcements")
        .insert([{
            title: isUrgent ? `[URGENT] ${title}` : title,
            content,
            // stub author_id
            author_id: "00000000-0000-0000-0000-000000000000"
        }])
        .select();

    if (error) {
        return { error: error.message };
    }

    return { success: true, data };
}
