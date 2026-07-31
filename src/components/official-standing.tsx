import { getPageSection } from "@/lib/actions";

const DEFAULTS = {
    charter: "10 March 1999",
    sponsor: "Rotary Club of Madras Industrial City",
    district: "3234",
    group: "01",
};

/**
 * Act I · the charter line.
 *
 * These are registry facts, so they're set as a registry line — one rule of
 * hairline-separated entries directly under the hero. Three glass cards made
 * institutional standing look like a feature comparison.
 */
export async function OfficialStanding() {
    const section = await getPageSection("standing");
    const charter = section?.charter || DEFAULTS.charter;
    const sponsor = section?.sponsor || DEFAULTS.sponsor;
    const district = section?.district || DEFAULTS.district;
    const group = section?.group || DEFAULTS.group;

    const entries = [
        { label: "Chartered", value: charter },
        { label: "Sponsored by", value: sponsor },
        { label: "District", value: `RI ${district} · Group ${group}` },
        { label: "Based in", value: "Chennai, Tamil Nadu" },
    ];

    return (
        <div
            id="standing"
            aria-label="Official standing"
            className="w-full border-y border-white/10 bg-white/[0.015]"
        >
            <dl className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x divide-white/10">
                {entries.map((entry, i) => (
                    <div
                        key={entry.label}
                        className="py-6 lg:py-7 lg:px-7 lg:first:pl-0 lg:last:pr-0 border-b border-white/5 sm:border-b-0 last:border-b-0"
                        data-reveal
                        data-reveal-delay={i * 80}
                    >
                        <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
                            {entry.label}
                        </dt>
                        <dd className="mt-2 font-heading font-semibold text-step-0 text-text-primary leading-snug">
                            {entry.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
