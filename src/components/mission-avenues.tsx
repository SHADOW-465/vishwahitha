import Link from "next/link";
import { getPageSection } from "@/lib/actions";

const AVENUES = [
    {
        name: "Club Service",
        desc: "Fellowship, meetings, and the culture that keeps the club running.",
    },
    {
        name: "Community Service",
        desc: "Local Chennai projects — elders, education, relief, and more.",
    },
    {
        name: "Professional Development",
        desc: "Skills, workshops, and careers built among peers.",
    },
    {
        name: "International Service",
        desc: "Cross-border fellowship and global-minded campaigns.",
    },
];

/**
 * Act IV opener · what the club is for.
 *
 * The mission gets the largest type in the act rather than being set in a
 * label-sized paragraph. The Avenues are Rotary's own named taxonomy, so
 * they're set as a list of terms — not four feature cards.
 */
export async function MissionAvenues() {
    const section = await getPageSection("mission");
    const mission =
        section?.mission ||
        "Empower young leaders in Chennai to drive community-led change through service, fellowship, and professional growth.";
    const vision =
        section?.vision ||
        "A club known for reliable service, clear leadership, and universal friendship — Vishwahita.";

    return (
        <div id="mission" className="max-w-7xl mx-auto px-6">
            <div className="max-w-4xl">
                <p
                    className="font-heading font-bold text-step-3 text-text-primary tracking-tight leading-[1.15]"
                    data-reveal
                >
                    {mission}
                </p>
                <p
                    className="mt-8 font-display-drama text-step-2 text-gold-ink leading-snug measure"
                    data-reveal
                    data-reveal-delay="140"
                >
                    {vision}
                </p>
            </div>

            <div className="mt-act-lead">
                <h3
                    className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-secondary pb-5 border-b border-white/10"
                    data-reveal
                >
                    Avenues of service
                </h3>
                <dl className="divide-y divide-white/10">
                    {AVENUES.map((a, i) => (
                        <div
                            key={a.name}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-8 py-6"
                            data-reveal
                            data-reveal-delay={i * 90}
                        >
                            <dt className="sm:col-span-4 font-heading font-bold text-step-1 text-text-primary">
                                {a.name}
                            </dt>
                            <dd className="sm:col-span-8 text-step-0 text-text-secondary measure">
                                {a.desc}
                            </dd>
                        </div>
                    ))}
                </dl>
                <Link
                    href="/initiatives"
                    className="inline-flex mt-8 text-step--1 text-gold-ink border-b border-accent-gold/40 pb-1 hover:border-accent-gold transition-colors"
                >
                    See projects by avenue →
                </Link>
            </div>
        </div>
    );
}
