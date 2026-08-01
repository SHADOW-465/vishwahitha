import { getPastPresidents } from "@/lib/actions";

type President = {
    id: string;
    name: string;
    term: string;
    note?: string | null;
    image_url?: string | null;
};

/**
 * /about · the roll of past presidents.
 *
 * A succession list, so it's set as one: terms running down a single rule,
 * most recent first. Portraits are optional — most clubs only have photos
 * for recent terms, and a grid of identical placeholder avatars would look
 * worse than no portrait at all.
 */
export async function PastPresidents() {
    const presidents = (await getPastPresidents()) as President[];

    return (
        <section id="past-presidents" aria-labelledby="past-presidents-heading">
            <div className="mb-10">
                <h2
                    id="past-presidents-heading"
                    className="font-heading text-step-3 font-extrabold text-text-primary tracking-tight"
                >
                    Past{" "}
                    <span className="font-display-drama text-gold-ink font-light">presidents</span>
                </h2>
                <p className="mt-3 text-step-0 text-text-secondary measure">
                    Every leader who has held the chair since the club was chartered in 1999.
                </p>
            </div>

            {presidents.length === 0 ? (
                <div className="border-y border-white/10 py-14 text-center">
                    <p className="font-heading font-bold text-step-1 text-text-primary">
                        The roll is being compiled
                    </p>
                    <p className="mt-2 text-step--1 text-text-secondary max-w-md mx-auto">
                        Past presidents will be listed here as the board confirms names and
                        terms. They can be added under Admin → Past Presidents.
                    </p>
                </div>
            ) : (
                <ol className="border-t border-white/10">
                    {presidents.map((p) => (
                        <li
                            key={p.id}
                            className="border-b border-white/10 grid grid-cols-1 sm:grid-cols-12 items-center gap-4 sm:gap-8 py-6"
                        >
                            <div className="sm:col-span-3">
                                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold-ink tabular-nums">
                                    {p.term}
                                </p>
                            </div>

                            <div className="sm:col-span-5 flex items-center gap-4 min-w-0">
                                {p.image_url && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={p.image_url}
                                        alt={`${p.name}, club president ${p.term}`}
                                        className="w-11 h-11 rounded-full object-cover border border-white/15 shrink-0"
                                    />
                                )}
                                <p className="font-heading font-bold text-step-1 text-text-primary leading-snug">
                                    {p.name}
                                </p>
                            </div>

                            <div className="sm:col-span-4">
                                {p.note && (
                                    <p className="text-step--1 text-text-secondary measure">
                                        {p.note}
                                    </p>
                                )}
                            </div>
                        </li>
                    ))}
                </ol>
            )}
        </section>
    );
}
