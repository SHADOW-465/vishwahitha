import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getGalleryPreview } from "@/lib/actions";

/**
 * Act III close · proof in pictures.
 *
 * Deliberately uneven — the first frame runs tall across two rows so the
 * grid reads as a contact sheet someone laid out, not six equal tiles.
 */
export async function GalleryTeaser() {
    const items = await getGalleryPreview(5);

    if (!items.length) {
        return null; // honest: no empty chrome when no real photos
    }

    return (
        <div id="gallery-preview" className="max-w-7xl mx-auto px-6">
            <div
                className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-act-beat"
                data-reveal
            >
                <h2 className="font-heading font-extrabold text-step-3 text-text-primary tracking-tight">
                    From the <span className="font-display-drama text-gold-ink">field</span>
                </h2>
                <Link
                    href="/gallery"
                    className="inline-flex items-center gap-1.5 text-step--1 text-gold-ink hover:text-accent-gold-light transition-colors shrink-0"
                >
                    Open gallery <ArrowRight size={13} />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {items.map((item: any, i: number) => {
                    const initiativeTitle =
                        item.initiatives?.title ||
                        (Array.isArray(item.initiatives) ? item.initiatives[0]?.title : null);
                    const label = item.caption || initiativeTitle;
                    const lead = i === 0;
                    return (
                        <figure
                            key={item.id}
                            data-reveal
                            data-reveal-delay={i * 70}
                            className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 group ${
                                lead
                                    ? "col-span-2 row-span-2 aspect-square md:aspect-auto"
                                    : "aspect-[4/3]"
                            }`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.image_url || ""}
                                alt={label || "Rotaract Vishwahita members on a service day"}
                                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                            />
                            {label && (
                                <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
                                    <p
                                        className={`text-text-primary line-clamp-2 ${
                                            lead ? "text-step-0 font-medium" : "text-step--1"
                                        }`}
                                    >
                                        {label}
                                    </p>
                                </figcaption>
                            )}
                        </figure>
                    );
                })}
            </div>
        </div>
    );
}
