import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getLegacyInitiative } from "@/lib/actions";

/** P1-7 — One flagship legacy project */
export async function LegacySpotlight() {
    const project = await getLegacyInitiative();

    if (!project) return null;

    return (
        <section id="legacy-project" className="py-20 md:py-24 px-6 w-full max-w-7xl mx-auto border-t border-white/5">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-gold">
                Legacy project
            </p>
            <h2 className="mt-1 font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-text-primary tracking-tight text-balance max-w-2xl">
                The work that defines{" "}
                <span className="font-display-drama gold-text">our name</span>
            </h2>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-7 relative min-h-[280px] rounded-[2rem] overflow-hidden border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={
                            project.hero_image_url ||
                            "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=1200"
                        }
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-accent-gold">
                            {project.category || "Signature"}
                        </span>
                        <p className="font-heading font-extrabold text-3xl sm:text-4xl text-text-primary mt-1">
                            {project.title}
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-5 glass-panel rounded-[2rem] border border-white/5 p-8 flex flex-col justify-between min-w-0">
                    <div>
                        <p className="font-mono text-sm text-text-secondary leading-relaxed">
                            {project.full_description ||
                                project.short_description ||
                                "A long-running programme at the heart of Vishwahita’s service record."}
                        </p>
                        {(project.impact_stat || project.impact_label) && (
                            <div className="mt-8">
                                <p className="font-heading font-extrabold text-3xl gold-text">
                                    {project.impact_stat}
                                </p>
                                <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary mt-1">
                                    {project.impact_label}
                                </p>
                            </div>
                        )}
                    </div>
                    <Link
                        href={`/initiatives/${project.slug}`}
                        className="mt-8 inline-flex items-center gap-2 font-mono text-xs text-text-primary border border-white/10 rounded-full px-5 py-2.5 hover:border-accent-gold/40 transition-colors w-fit"
                    >
                        Read the full story <ArrowUpRight size={12} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
