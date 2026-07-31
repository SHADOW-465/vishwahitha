import { supabase } from "@/lib/supabase";
import { GalleryGrid } from "@/components/gallery-grid";

export const revalidate = 60;

export default async function GalleryPage() {
    const { data: gallery } = await supabase
        .from("gallery_media")
        .select("*, initiatives(title)")
        .order("created_at", { ascending: false });

    const items = (gallery ?? []).map((item: any) => ({
        ...item,
        // Normalize CMS shapes for the grid
        url: item.url || item.image_url,
        title: item.title || item.caption,
        type: item.type || "image",
    }));
    const categories = Array.from(
        new Set(items.map((i: any) => i.initiatives?.title).filter(Boolean))
    ) as string[];

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
            <div className="mb-12 max-w-2xl">
                <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight text-balance">
                    Gallery
                </h1>
                <p className="text-text-secondary mt-3 leading-relaxed">
                    Real moments from club service and fellowship. Empty when no photos are published.
                </p>
            </div>

            {items.length > 0 ? (
                <GalleryGrid items={items} categories={categories} />
            ) : (
                <div className="py-20 text-center text-text-secondary text-sm rounded-[2rem] border border-white/8 bg-white/[0.02]">
                    No photos published yet. When the board adds media, they will appear here.
                </div>
            )}
        </div>
    );
}
