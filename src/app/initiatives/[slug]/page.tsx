import { getInitiativeBySlug, getInitiatives } from "@/lib/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
    const initiatives = await getInitiatives();
    return initiatives.map((i: { slug: string }) => ({ slug: i.slug }));
}

export default async function InitiativeDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const initiative = await getInitiativeBySlug(slug);
    if (!initiative) notFound();

    const gallery = initiative.initiative_gallery ?? [];

    return (
        <div className="min-h-screen">
            <section className="relative w-full min-h-[50vh] md:min-h-[60vh] flex items-end overflow-hidden">
                {initiative.hero_image_url ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${initiative.hero_image_url})` }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent-gold/10 to-primary" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full pt-28">
                    <Link
                        href="/initiatives"
                        className="flex items-center gap-2 font-mono text-xs text-text-secondary hover:text-text-primary transition-colors mb-6 w-fit"
                    >
                        <ArrowLeft size={14} /> All projects
                    </Link>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-accent-gold mb-2">
                        {initiative.category}
                    </p>
                    <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-text-primary tracking-tight text-balance">
                        {initiative.title}
                    </h1>
                    {(initiative.impact_stat || initiative.impact_label) && (
                        <p className="mt-4 font-mono text-sm text-text-secondary">
                            {initiative.impact_stat}
                            {initiative.impact_label ? ` · ${initiative.impact_label}` : ""}
                        </p>
                    )}
                </div>
            </section>

            {initiative.full_description || initiative.short_description ? (
                <section className="py-16 md:py-20 px-6 max-w-3xl mx-auto">
                    <h2 className="font-heading text-2xl font-bold text-text-primary mb-6">
                        About this project
                    </h2>
                    <div className="text-text-secondary leading-relaxed whitespace-pre-line">
                        {initiative.full_description || initiative.short_description}
                    </div>
                </section>
            ) : null}

            {gallery.length > 0 && (
                <section className="py-12 px-6 max-w-7xl mx-auto">
                    <h2 className="font-heading text-2xl font-bold text-text-primary mb-8">Gallery</h2>
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                        {gallery.map((item: { id: string; image_url: string; caption?: string }) => (
                            <div key={item.id} className="break-inside-avoid rounded-2xl overflow-hidden border border-white/8">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.image_url}
                                    alt={item.caption || initiative.title}
                                    className="w-full object-cover"
                                />
                                {item.caption && (
                                    <p className="p-3 font-mono text-[11px] text-text-secondary">
                                        {item.caption}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="py-16 md:py-20 px-6 text-center border-t border-white/5">
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-3">
                    Want to get involved?
                </h2>
                <p className="text-text-secondary mb-8 max-w-md mx-auto text-sm leading-relaxed">
                    Apply to join Vishwahita — the board will follow up with orientation steps.
                </p>
                <Link
                    href="/#join"
                    className="inline-block bg-accent-cranberry text-text-primary font-bold px-8 py-3.5 rounded-full hover:bg-[#e01872] transition-colors"
                >
                    Apply to join
                </Link>
            </section>
        </div>
    );
}
