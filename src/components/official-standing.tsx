import { getPageSection } from "@/lib/actions";

const DEFAULTS = {
    charter: "10 March 1999",
    clubNumber: "46323",
    sponsor: "Rotary Club of Madras Industrial City",
    district: "3234",
    group: "02",
};

/**
 * Act I · the charter line.
 *
 * These are registry facts, so they're set as a registry line — one rule of
 * hairline-separated entries directly under the hero.
 */
export async function OfficialStanding() {
    const section = await getPageSection("standing");
    const charter = section?.charter || DEFAULTS.charter;
    const clubNumber = section?.club_number || section?.clubNumber || DEFAULTS.clubNumber;
    const sponsor = section?.sponsor || DEFAULTS.sponsor;
    const district = section?.district || DEFAULTS.district;
    const group = section?.group || DEFAULTS.group;

    const entries = [
        { label: "Chartered", value: charter },
        { label: "Club No.", value: `RI Club #${clubNumber}` },
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
            <dl className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 lg:divide-x divide-white/10">
                {entries.map((entry, i) => (
                    <div
                        key={entry.label}
                        className={`py-5 sm:py-6 lg:py-7 sm:px-4 lg:px-6 lg:first:pl-0 lg:last:pr-0 border-b border-white/10 lg:border-b-0 last:border-b-0 ${
                            entry.label === "Sponsored by" ? "sm:col-span-2 lg:col-span-1" : ""
                        }`}
                        data-reveal
                        data-reveal-delay={i * 70}
                    >
                        <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-secondary">
                            {entry.label}
                        </dt>
                        <dd className="mt-1.5 font-heading font-semibold text-sm sm:text-base md:text-step-0 text-text-primary leading-snug">
                            {entry.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
