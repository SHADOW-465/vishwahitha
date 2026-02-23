import { supabase } from "@/lib/supabase";

export async function getPublicEvents() {
    const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_public", true)
        .order("date", { ascending: true })
        .limit(5);

    if (error) {
        console.error("Error fetching events:", error);
        return [];
    }
    return data;
}



export async function getFeedback() {
    const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching feedback:", error);
        return [];
    }
    return data;
}
