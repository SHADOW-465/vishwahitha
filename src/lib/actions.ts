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

export async function getInitiatives() {
    const { data, error } = await supabase
        .from("initiatives")
        .select("*")
        .eq("is_featured", true)
        .order("display_order", { ascending: true });

    if (error) { console.error("getInitiatives:", error); return []; }
    return data ?? [];
}

export async function getPublicAnnouncements() {
    const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("visibility", "public")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) { console.error("getPublicAnnouncements:", error); return []; }
    return data ?? [];
}

export async function getAllAnnouncements() {
    const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) { console.error("getAllAnnouncements:", error); return []; }
    return data ?? [];
}

export async function getInitiativeBySlug(slug: string) {
    const { data, error } = await supabase
        .from("initiatives")
        .select("*, initiative_gallery(*)")
        .eq("slug", slug)
        .single();

    if (error) { console.error("getInitiativeBySlug:", error); return null; }
    return data;
}
