import { supabase } from "@/lib/supabase";
import { GalleryGrid } from "@/components/gallery-grid";

export const revalidate = 60;

export default async function GalleryPage() {
    const { data: gallery } = await supabase
        .from("gallery_media")
        .select("*, initiatives(title)")
        .order("created_at", { ascending: false });

    const items = gallery ?? [];
    const categories = Array.from(
        new Set(items.map((i: any) => i.initiatives?.title).filter(Boolean))
    ) as string[];

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
            <div className="mb-12">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold mb-4">
                    Our Moments
                </p>
                <h1 className="font-heading text-5xl md:text-7xl font-bold text-text-primary">
                    Visual{" "}
                    <span className="font-drama italic gold-text font-light text-6xl md:text-8xl">
                        Archive
                    </span>
                </h1>
                <p className="font-mono text-text-secondary mt-4 max-w-lg">
                    A chronicle of service, community, and impact — captured one frame at a time.
                </p>
            </div>

            {items.length > 0 ? (
                <GalleryGrid items={items} categories={categories} />
            ) : (
                <div className="py-24 text-center text-text-secondary font-mono text-sm glass-panel rounded-[2rem] border border-white/5">
                    The visual archive is currently empty.
                </div>
            )}
        </div>
    );
}
