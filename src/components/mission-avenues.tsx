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

/** P1-10 + P1-11 — Mission + avenues map (not generic feature cards) */
export async function MissionAvenues() {
    const section = await getPageSection("mission");
    const mission =
        section?.mission ||
        "Empower young leaders in Chennai to drive community-led change through service, fellowship, and professional growth.";
    const vision =
        section?.vision ||
        "A club known for reliable service, clear leadership, and universal friendship — Vishwahita.";

    return (
        <section id="mission" className="py-20 md:py-24 px-6 w-full max-w-7xl mx-auto border-t border-white/5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                <div className="lg:col-span-5 min-w-0 space-y-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-gold">
                        Mission
                    </p>
                    <p className="font-heading font-bold text-xl sm:text-2xl text-text-primary leading-snug text-balance">
                        {mission}
                    </p>
                    <div className="border-l-2 border-accent-gold/30 pl-4">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-text-secondary mb-1">
                            Vision
                        </p>
                        <p className="font-display-drama text-xl sm:text-2xl gold-text leading-snug">
                            {vision}
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-7 min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-cranberry mb-4">
                        Avenues of service
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {AVENUES.map((a) => (
                            <div
                                key={a.name}
                                className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 min-w-0"
                            >
                                <h3 className="font-heading font-bold text-text-primary text-base">
                                    {a.name}
                                </h3>
                                <p className="mt-2 font-mono text-xs text-text-secondary leading-relaxed">
                                    {a.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                    <Link
                        href="/initiatives"
                        className="inline-flex mt-5 font-mono text-xs text-accent-gold hover:underline"
                    >
                        See projects by avenue →
                    </Link>
                </div>
            </div>
        </section>
    );
}
