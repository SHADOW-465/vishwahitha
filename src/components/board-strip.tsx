import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBoardMembers } from "@/lib/actions";

const FALLBACK = [
    { id: "fb-1", name: "Rtr. Mahalakshmi", role: "Club President", image_url: null as string | null },
    { id: "fb-2", name: "Rtr. Nandhini", role: "Club Secretary", image_url: null },
];

/**
 * Act IV · the people.
 *
 * Portraits at portrait proportions with the name set below, the way a club
 * board is actually pictured. Was: a 56px avatar inside a glass card, which
 * made the leadership look like a contacts list.
 */
export async function BoardStrip() {
    const members = await getBoardMembers();
    const list = members.length > 0 ? members.slice(0, 6) : FALLBACK;

    return (
        <div id="board" className="max-w-7xl mx-auto px-6">
            <div
                className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-act-beat"
                data-reveal
            >
                <h2 className="font-heading font-extrabold text-step-3 text-text-primary tracking-tight">
                    Who you&apos;ll{" "}
                    <span className="font-display-drama text-gold-ink">meet</span>
                </h2>
                <Link
                    href="/about"
                    className="inline-flex items-center gap-1.5 text-step--1 text-gold-ink hover:text-accent-gold-light transition-colors shrink-0"
                >
                    Full about <ArrowRight size={13} />
                </Link>
            </div>

            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
                {list.map((m: { id: string; name: string; role: string; image_url?: string | null }, i: number) => (
                    <li key={m.id} data-reveal data-reveal-delay={i * 70} className="min-w-0">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                            {m.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={m.image_url}
                                    alt={`${m.name}, ${m.role}`}
                                    className="absolute inset-0 w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity duration-500"
                                />
                            ) : (
                                <span
                                    className="absolute inset-0 flex items-center justify-center font-heading font-extrabold text-step-3 text-accent-gold/45"
                                    aria-hidden
                                >
                                    {m.name.replace(/^Rtr\.\s*/i, "").charAt(0)}
                                </span>
                            )}
                        </div>
                        <p className="mt-3 font-heading font-bold text-step-0 text-text-primary leading-snug">
                            {m.name}
                        </p>
                        <p className="mt-1 text-step--1 text-text-secondary leading-snug">
                            {m.role}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
