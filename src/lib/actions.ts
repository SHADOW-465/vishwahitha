import { supabase } from "@/lib/supabase";

export async function getPublicEvents(limit = 5) {
    const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_public", true)
        .order("date", { ascending: true })
        .limit(limit);

    if (error) {
        console.error("Error fetching events:", error);
        return [];
    }
    return data ?? [];
}

/** All public events, split for listing pages */
export async function getPublicEventsCatalog() {
    const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_public", true)
        .order("date", { ascending: true });

    if (error) {
        console.error("getPublicEventsCatalog:", error);
        return { upcoming: [] as any[], past: [] as any[], online: [] as any[] };
    }

    const now = Date.now();
    const all = data ?? [];
    const upcoming = all.filter((e) => e.date && new Date(e.date).getTime() >= now);
    const past = all
        .filter((e) => e.date && new Date(e.date).getTime() < now)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const online = all.filter((e) => e.is_online === true);

    return { upcoming, past, online, all };
}

export async function getEventById(id: string) {
    const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .eq("is_public", true)
        .maybeSingle();

    if (error) {
        console.error("getEventById:", error);
        return null;
    }
    return data;
}

export async function getBoardMembers() {
    const { data, error } = await supabase
        .from("board_members")
        .select("*")
        .order("display_order", { ascending: true });

    if (error) {
        console.error("getBoardMembers:", error);
        return [];
    }
    return data ?? [];
}

export async function getGalleryPreview(limit = 6) {
    const { data, error } = await supabase
        .from("gallery_media")
        .select("id, image_url, caption, created_at, initiatives(title)")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("getGalleryPreview:", error);
        return [];
    }
    return data ?? [];
}

export async function getLegacyInitiative() {
    const { data, error } = await supabase
        .from("initiatives")
        .select("*")
        .eq("is_legacy", true)
        .order("display_order", { ascending: true })
        .limit(1)
        .maybeSingle();

    if (error || !data) {
        // Fallback: first featured if is_legacy column missing or empty
        const featured = await getInitiatives();
        return featured[0] ?? null;
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

export async function getPageSection(key: string): Promise<Record<string, any> | null> {
    const { data, error } = await supabase
        .from("page_sections")
        .select("content")
        .eq("section_key", key)
        .single();

    if (error) { return null; }
    return (data?.content as Record<string, any>) ?? null;
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
