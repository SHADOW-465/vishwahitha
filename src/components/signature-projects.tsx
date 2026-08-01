import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getSignatureInitiatives } from "@/lib/actions";
import { SignatureText } from "@/components/ui/signature-text";

/** The five the club is known for, with copy from the 2026–27 year plan.
 *  Used until the migration is applied — never an empty flagship block. */
const FALLBACK = [
    {
        slug: "visil",
        title: "Visil",
        category: "Back to school days",
        short_description:
            "Reviving classic school sports games to reignite the joy and camaraderie of childhood.",
    },
    {
        slug: "vawez",
        title: "Vawez",
        category: "Culture for clean water",
        short_description:
            "A cultural dance showcase raising funds to fit water-saving taps in schools.",
    },
    {
        slug: "vaagai",
        title: "Vaagai",
        category: "Elder care",
        short_description:
            "Ganesh Chaturthi celebrations in old age homes, so elderly residents share in the festival.",
    },
    {
        slug: "vannangal",
        title: "Vannangal",
        category: "Orphanage outreach",
        short_description:
            "Speakers bringing knowledge, skills and support to young people living in orphanages.",
    },
    {
        slug: "peace",
        title: "Peace",
        category: "International service",
        short_description:
            "Rotaractors worldwide sharing the peace symbol — one collective image of solidarity.",
    },
];

type Initiative = {
    id?: string;
    slug: string;
    title: string;
    category?: string | null;
    short_description?: string | null;
    impact_stat?: string | null;
    impact_label?: string | null;
};

/**
 * Act III opener · the signed work.
 *
 * The club signs the section, then signs each project in turn — the five
 * names ink themselves in sequence as you read down. Everything is fully
 * inked before JS runs, so the names are never gated behind the animation.
 */
export async function SignatureProjects() {
    const fetched = (await getSignatureInitiatives()) as Initiative[];
    const list = fetched.length > 0 ? fetched : (FALLBACK as Initiative[]);

    return (
        <div id="signature-projects" className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl">
                <SignatureText
                    as="h2"
                    className="text-step-5 leading-[1.15] text-gold-ink"
                >
                    Signature Projects
                </SignatureText>

                {/* The line you sign above. */}
                <span
                    className="mt-4 block h-px w-full max-w-lg bg-gradient-to-r from-accent-gold/50 to-transparent"
                    aria-hidden
                />

                <p className="mt-7 text-step-1 text-text-primary/85 measure leading-relaxed" data-reveal>
                    Five programmes carry the club&apos;s name. They run every term,
                    they are what Vishwahita is known for in District 3234, and they
                    are the work we put our name to.
                </p>
            </div>

            <ol className="mt-act-lead border-t border-white/12">
                {list.map((project, i) => (
                    <li key={project.slug} className="border-b border-white/12">
                        <Link
                            href={`/initiatives/${project.slug}`}
                            className="group grid grid-cols-1 md:grid-cols-12 items-baseline gap-3 md:gap-8 py-8 md:py-10 transition-colors duration-500 hover:bg-white/[0.03] -mx-4 px-4"
                        >
                            <div className="md:col-span-5">
                                <SignatureText
                                    as="h3"
                                    delay={520 + i * 300}
                                    className="text-step-4 leading-[1.2] text-text-primary transition-colors duration-500 group-hover:text-gold-ink"
                                >
                                    {project.title}
                                </SignatureText>
                            </div>

                            <div className="md:col-span-5">
                                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
                                    {project.category || "Signature project"}
                                </p>
                                {project.short_description && (
                                    <p className="mt-2 text-step-0 text-text-secondary measure">
                                        {project.short_description}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2 flex items-center justify-start md:justify-end gap-3">
                                {project.impact_stat && (
                                    <span className="font-heading font-extrabold text-step-1 text-gold-ink tabular-nums">
                                        {project.impact_stat}
                                    </span>
                                )}
                                <ArrowUpRight
                                    size={18}
                                    className="text-text-secondary group-hover:text-gold-ink group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300"
                                />
                            </div>
                        </Link>
                    </li>
                ))}
            </ol>
        </div>
    );
}
