import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getInitiatives } from "@/lib/actions";

const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200";

type Initiative = {
    id?: string;
    slug: string;
    title: string;
    category?: string | null;
    short_description?: string | null;
    impact_stat?: string | null;
    impact_label?: string | null;
    hero_image_url?: string | null;
};

/**
 * Act III · the programme index.
 *
 * One lead programme at plate scale, the rest as an indexed run of entries.
 * The old version was six equal cards tinted gold/teal/red on rotation — the
 * colour carried no meaning, and equal weight meant nothing led.
 */
export async function FeaturedBento() {
    const initiatives = (await getInitiatives()) as Initiative[];
    const list = initiatives.slice(0, 6);

    if (list.length === 0) {
        return (
            <div id="initiatives" className="max-w-7xl mx-auto px-6" data-reveal>
                <p className="text-step-0 text-text-secondary">
                    No featured programmes yet. The president can add them under Admin →
                    Initiatives.
                </p>
            </div>
        );
    }

    const [lead, ...rest] = list;

    return (
        <div id="initiatives" className="max-w-7xl mx-auto px-6">
            <div
                className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-act-beat"
                data-reveal
            >
                <div>
                    <h2 className="font-heading font-extrabold text-step-3 text-text-primary tracking-tight max-w-2xl">
                        Programmes the board{" "}
                        <span className="font-display-drama text-gold-ink">runs</span>
                    </h2>
                    <p className="mt-4 text-step-0 text-text-secondary measure">
                        Daily series and flagship work, kept current by the board.
                    </p>
                </div>
                <Link
                    href="/initiatives"
                    className="inline-flex items-center gap-1.5 text-step--1 text-gold-ink hover:text-accent-gold-light transition-colors shrink-0"
                >
                    All initiatives <ArrowUpRight size={13} />
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Lead programme — the only one that gets an image at size. */}
                <Link
                    href={`/initiatives/${lead.slug}`}
                    className="group lg:col-span-7 block"
                    data-reveal
                >
                    <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden rounded-[2rem] border border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={lead.hero_image_url || FALLBACK_IMAGE}
                            alt={lead.title}
                            className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity duration-700 group-hover:opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold-ink">
                                {lead.category || "Signature"}
                            </p>
                            <h3 className="mt-2 font-heading font-extrabold text-step-3 text-text-primary tracking-tight">
                                {lead.title}
                            </h3>
                        </div>
                    </div>
                    {lead.short_description && (
                        <p className="mt-5 text-step-0 text-text-secondary measure">
                            {lead.short_description}
                        </p>
                    )}
                    {lead.impact_stat && (
                        <p className="mt-4 font-heading font-extrabold text-step-2 text-gold-ink tabular-nums">
                            {lead.impact_stat}{" "}
                            <span className="font-mono text-[10px] font-normal uppercase tracking-[0.22em] text-text-secondary align-middle">
                                {lead.impact_label}
                            </span>
                        </p>
                    )}
                </Link>

                {/* The rest — an index, not more cards. */}
                {rest.length > 0 && (
                    <ol className="lg:col-span-5 divide-y divide-white/10 border-t border-white/10">
                        {rest.map((init, i) => (
                            <li key={init.id || init.slug} data-reveal data-reveal-delay={i * 90}>
                                <Link
                                    href={`/initiatives/${init.slug}`}
                                    className="group flex items-start gap-5 py-6 transition-colors duration-300 hover:bg-white/[0.03] -mx-3 px-3"
                                >
                                    <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={init.hero_image_url || FALLBACK_IMAGE}
                                            alt=""
                                            className="h-full w-full object-cover opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
                                            {init.category || "Programme"}
                                        </p>
                                        <h3 className="mt-1.5 font-heading font-bold text-step-1 text-text-primary leading-snug group-hover:text-gold-ink transition-colors">
                                            {init.title}
                                        </h3>
                                        {init.impact_stat && (
                                            <p className="mt-1.5 text-step--1 text-text-secondary tabular-nums">
                                                {init.impact_stat} {init.impact_label}
                                            </p>
                                        )}
                                    </div>
                                    <ArrowUpRight
                                        size={16}
                                        className="mt-1 shrink-0 text-text-secondary group-hover:text-gold-ink group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300"
                                    />
                                </Link>
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </div>
    );
}
