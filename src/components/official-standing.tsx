import { getPageSection } from "@/lib/actions";

const DEFAULTS = {
    charter: "10 March 1999",
    sponsor: "Rotary Club of Madras Industrial City",
    district: "3234",
    group: "01",
};

/** P1-3 — Institutional spine: charter · sponsor · District */
export async function OfficialStanding() {
    const section = await getPageSection("standing");
    const charter = section?.charter || DEFAULTS.charter;
    const sponsor = section?.sponsor || DEFAULTS.sponsor;
    const district = section?.district || DEFAULTS.district;
    const group = section?.group || DEFAULTS.group;

    const cards = [
        { label: "Chartered", value: charter, hint: "Rotaract Club of Vishwahita" },
        { label: "Sponsored by", value: sponsor, hint: "Parent Rotary club" },
        { label: "District", value: `RI ${district}`, hint: `Group ${group} · Chennai` },
    ];

    return (
        <section
            id="standing"
            aria-labelledby="standing-heading"
            className="w-full border-y border-white/10 bg-white/[0.02]"
        >
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-14">
                <h2
                    id="standing-heading"
                    className="font-heading font-extrabold text-2xl sm:text-3xl text-text-primary tracking-tight mb-8 text-balance"
                >
                    Official standing
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {cards.map((card) => (
                        <div
                            key={card.label}
                            className="rounded-2xl p-6 border border-white/8 bg-white/[0.03] min-w-0"
                        >
                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                                {card.label}
                            </p>
                            <p className="mt-2 font-heading font-bold text-lg sm:text-xl text-text-primary leading-snug text-balance">
                                {card.value}
                            </p>
                            <p className="mt-2 font-mono text-xs text-text-secondary">{card.hint}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
