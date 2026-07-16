import { supabase } from "@/lib/supabase";

/** Public milestones strip (CMS-backed) */
export async function MilestonesStrip() {
    const { data } = await supabase
        .from("milestones")
        .select("*")
        .order("display_order", { ascending: true })
        .limit(8);

    const items = data ?? [];
    if (items.length === 0) return null;

    return (
        <section id="milestones" className="py-16 md:py-20 px-6 w-full max-w-7xl mx-auto border-t border-white/5">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-gold">
                Milestones
            </p>
            <h2 className="mt-1 font-heading font-extrabold text-3xl sm:text-4xl text-text-primary tracking-tight text-balance">
                Along the <span className="font-display-drama gold-text">way</span>
            </h2>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((m: { id: string; year: string; title: string; body?: string | null }) => (
                    <div
                        key={m.id}
                        className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 min-w-0"
                    >
                        <p className="font-mono text-[10px] uppercase tracking-wider text-accent-gold">
                            {m.year}
                        </p>
                        <h3 className="mt-2 font-heading font-bold text-text-primary text-lg leading-snug">
                            {m.title}
                        </h3>
                        {m.body && (
                            <p className="mt-2 font-mono text-xs text-text-secondary leading-relaxed">
                                {m.body}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
