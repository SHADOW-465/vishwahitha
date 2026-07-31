import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getLegacyInitiative } from "@/lib/actions";

/**
 * Act III opener · the flagship.
 *
 * The only full-bleed moment on the page. One project, one photograph, at a
 * scale nothing else gets — so the act opens on evidence rather than on
 * another heading above another grid.
 */
export async function LegacySpotlight() {
    const project = await getLegacyInitiative();

    if (!project) return null;

    return (
        <div id="legacy-project" className="w-full">
            <figure className="relative w-full h-[62vh] min-h-[26rem] max-h-[42rem] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={
                        project.hero_image_url ||
                        "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1600"
                    }
                    alt={`${project.title} — Rotaract Club of Vishwahita in the field`}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/55 to-primary/20" />

                <figcaption className="absolute inset-x-0 bottom-0">
                    <div className="max-w-7xl mx-auto px-6 pb-10 md:pb-14">
                        <p
                            className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-ink"
                            data-reveal
                        >
                            {project.category || "Signature project"}
                        </p>
                        <h2
                            className="mt-3 font-heading font-extrabold text-step-5 text-text-primary tracking-tighter max-w-4xl"
                            data-reveal="wipe"
                        >
                            {project.title}
                        </h2>
                    </div>
                </figcaption>
            </figure>

            <div className="max-w-7xl mx-auto px-6 mt-act-beat">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
                    <div className="lg:col-span-7" data-reveal>
                        <p className="text-step-1 text-text-primary/90 leading-relaxed measure">
                            {project.full_description ||
                                project.short_description ||
                                "A long-running programme at the heart of Vishwahita's service record."}
                        </p>
                        <Link
                            href={`/initiatives/${project.slug}`}
                            className="mt-8 inline-flex items-center gap-2 text-step--1 text-text-primary border-b border-accent-gold/40 pb-1 hover:border-accent-gold transition-colors w-fit"
                        >
                            Read the full story <ArrowUpRight size={13} />
                        </Link>
                    </div>

                    {(project.impact_stat || project.impact_label) && (
                        <div className="lg:col-span-4 lg:col-start-9" data-reveal data-reveal-delay="120">
                            <p className="font-heading font-extrabold text-step-4 text-gold-ink tabular-nums leading-none">
                                {project.impact_stat}
                            </p>
                            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
                                {project.impact_label}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
