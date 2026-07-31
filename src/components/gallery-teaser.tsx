import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getGalleryPreview } from "@/lib/actions";

/** P1-9 — Light public gallery proof */
export async function GalleryTeaser() {
    const items = await getGalleryPreview(6);

    if (!items.length) {
        return null; // honest: no empty chrome when no real photos
    }

    return (
        <section id="gallery-preview" className="py-20 md:py-24 px-6 w-full max-w-7xl mx-auto border-t border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                <div>
                    <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-text-primary tracking-tight text-balance">
                        From club projects
                    </h2>
                </div>
                <Link
                    href="/gallery"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-gold hover:text-accent-gold-light transition-colors"
                >
                    Open gallery <ArrowRight size={12} />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {items.map((item: any) => {
                    const initiativeTitle =
                        item.initiatives?.title ||
                        (Array.isArray(item.initiatives) ? item.initiatives[0]?.title : null);
                    const label = item.caption || initiativeTitle;
                    return (
                        <figure
                            key={item.id}
                            className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-white/5 group"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.image_url || ""}
                                alt={label || "Club moment"}
                                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                            />
                            {label && (
                                <figcaption className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="font-mono text-[10px] text-text-primary line-clamp-2">
                                        {label}
                                    </p>
                                </figcaption>
                            )}
                        </figure>
                    );
                })}
            </div>
        </section>
    );
}
