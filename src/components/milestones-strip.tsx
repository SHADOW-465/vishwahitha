import { supabase } from "@/lib/supabase";

/**
 * Act IV close · the record.
 *
 * A genuine chronology, so it's set as one — years at display scale down the
 * left, entries hanging off a single rule. Four equal boxes hid the fact that
 * this is a sequence at all.
 */
export async function MilestonesStrip() {
    const { data } = await supabase
        .from("milestones")
        .select("*")
        .order("display_order", { ascending: true })
        .limit(8);

    const items = data ?? [];
    if (items.length === 0) return null;

    return (
        <div id="milestones" className="max-w-7xl mx-auto px-6">
            <h2
                className="font-heading font-extrabold text-step-3 text-text-primary tracking-tight mb-act-beat"
                data-reveal
            >
                Along the <span className="font-display-drama text-gold-ink">way</span>
            </h2>

            <ol className="border-l border-white/10 pl-6 sm:pl-10 space-y-10 sm:space-y-12">
                {items.map((m: { id: string; year: string; title: string; body?: string | null }, i: number) => (
                    <li
                        key={m.id}
                        className="relative grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-8"
                        data-reveal
                        data-reveal-delay={i * 80}
                    >
                        <span
                            className="absolute -left-6 sm:-left-10 top-3 w-1.5 h-1.5 rounded-full bg-accent-gold -translate-x-[3.5px]"
                            aria-hidden
                        />
                        <p className="sm:col-span-3 font-heading font-extrabold text-step-2 text-gold-ink tabular-nums leading-none">
                            {m.year}
                        </p>
                        <div className="sm:col-span-9">
                            <h3 className="font-heading font-bold text-step-1 text-text-primary leading-snug">
                                {m.title}
                            </h3>
                            {m.body && (
                                <p className="mt-2 text-step-0 text-text-secondary measure">
                                    {m.body}
                                </p>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}
