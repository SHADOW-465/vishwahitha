import { getInitiativeBySlug, getInitiatives } from "@/lib/actions";
import { ImpactCounter } from "@/components/impact-counter";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
    const initiatives = await getInitiatives();
    return initiatives.map((i: { slug: string }) => ({ slug: i.slug }));
}

export default async function InitiativeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const initiative = await getInitiativeBySlug(slug);
    if (!initiative) notFound();

    const gallery = initiative.initiative_gallery ?? [];

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative w-full h-[70vh] flex items-end overflow-hidden">
                {initiative.hero_image_url ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${initiative.hero_image_url})` }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent-gold/10 to-primary" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
                    <Link href="/initiatives" className="flex items-center gap-2 font-mono text-xs text-text-secondary hover:text-text-primary transition-colors mb-6 w-fit">
                        <ArrowLeft size={14} /> All Initiatives
                    </Link>
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold mb-3">{initiative.category}</p>
                    <h1 className="font-heading text-5xl md:text-7xl font-bold text-text-primary">{initiative.title}</h1>
                </div>
            </section>

            {/* Impact stats bar */}
            {initiative.impact_stat && (
                <section className="bg-accent-gold/5 border-y border-accent-gold/15 py-12">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                            <ImpactCounter value={initiative.impact_stat} label={initiative.impact_label || "impact"} />
                            <div className="hidden md:block w-px h-12 bg-white/10" />
                            <div className="text-center">
                                <p className="font-heading text-4xl md:text-5xl font-bold gold-text">Active</p>
                                <p className="font-mono text-xs text-text-secondary uppercase tracking-widest mt-2">Status</p>
                            </div>
                            <div className="hidden md:block w-px h-12 bg-white/10" />
                            <div className="text-center">
                                <p className="font-heading text-4xl md:text-5xl font-bold gold-text">2025–26</p>
                                <p className="font-mono text-xs text-text-secondary uppercase tracking-widest mt-2">Current Year</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Full description */}
            {initiative.full_description && (
                <section className="py-24 px-6 max-w-4xl mx-auto">
                    <h2 className="font-heading text-3xl font-bold text-text-primary mb-8">
                        About <span className="font-drama italic gold-text font-light">{initiative.title}</span>
                    </h2>
                    <div className="font-mono text-text-secondary leading-relaxed text-base whitespace-pre-line">
                        {initiative.full_description}
                    </div>
                </section>
            )}

            {/* Photo gallery */}
            {gallery.length > 0 && (
                <section className="py-16 px-6 max-w-7xl mx-auto">
                    <h2 className="font-heading text-2xl font-bold text-text-primary mb-8">Gallery</h2>
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                        {gallery.map((item: { id: string; image_url: string; caption?: string }) => (
                            <div key={item.id} className="break-inside-avoid rounded-2xl overflow-hidden">
                                <img src={item.image_url} alt={item.caption || initiative.title} className="w-full object-cover" />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="py-24 px-6 text-center">
                <h2 className="font-heading text-3xl md:text-5xl font-bold text-text-primary mb-4">
                    Want to <span className="font-drama italic gold-text font-light">get involved?</span>
                </h2>
                <p className="font-mono text-text-secondary mb-8 max-w-md mx-auto">
                    Join the {initiative.title} team and make a difference in your community.
                </p>
                <Link
                    href="/sign-up"
                    className="inline-block bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform"
                >
                    Join Vishwahita
                </Link>
            </section>
        </div>
    );
}
