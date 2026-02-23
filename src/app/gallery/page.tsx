import { supabase } from "@/lib/supabase";

export default async function GalleryPage() {
    // Fetch live gallery media
    const { data: gallery } = await supabase
        .from("gallery_media")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-text-primary mb-12">
                Visual <span className="text-accent-gold italic font-drama font-light text-6xl md:text-8xl">Archive</span>
            </h1>

            {/* Masonry CSS Grid Layout */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {gallery && gallery.length > 0 ? (
                    gallery.map((item) => (
                        <div key={item.id} className="w-full break-inside-avoid relative group rounded-2xl overflow-hidden mb-6">
                            {item.type === 'video' ? (
                                <video src={item.url} controls className="w-full rounded-2xl border border-white/10" />
                            ) : (
                                <img src={item.url} alt={item.title || "Club photo"} className="w-full rounded-2xl border border-white/10 group-hover:scale-[1.02] transition-transform duration-500" />
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="font-heading font-medium text-white">{item.title}</p>
                                <p className="font-mono text-[10px] text-white/70 uppercase tracking-widest">{new Date(item.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center text-text-secondary font-mono text-sm glass-panel rounded-[2rem] border border-white/5">
                        The visual archive is currently empty.
                    </div>
                )}
            </div>
        </div>
    );
}
