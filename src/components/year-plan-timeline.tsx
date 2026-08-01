import Link from "next/link";

/**
 * 2026–27 Year Plan · the project timeline.
 *
 * Transcribed from the President Elect's year-plan deck (slides 14–15). The
 * Rotary year runs July → June, so the list starts in July rather than
 * January.
 *
 * Layout: a single spine with entries alternating either side on large
 * screens, collapsing to one column with a left-hand spine below that. The
 * alternation is the content's own shape — a year has two halves — not
 * decoration.
 */

type Kind = "signature" | "multi" | "community" | "club" | "district";

const KIND_LABEL: Record<Kind, string> = {
    signature: "Signature project",
    multi: "Multi-avenue",
    community: "Community service",
    club: "Club service",
    district: "Club calendar",
};

type Entry = {
    month: string;
    /** JS month index, for working out which entry is live right now. */
    monthIndex: number;
    calendarYear: number;
    project: string;
    kind: Kind;
    /** Signature projects deep-link to their own page. */
    slug?: string;
};

const YEAR_PLAN: Entry[] = [
    { month: "July",      monthIndex: 6,  calendarYear: 2026, project: "Orientation",      kind: "district" },
    { month: "August",    monthIndex: 7,  calendarYear: 2026, project: "Installation",     kind: "district" },
    { month: "September", monthIndex: 8,  calendarYear: 2026, project: "Vaagai",           kind: "signature", slug: "vaagai" },
    { month: "October",   monthIndex: 9,  calendarYear: 2026, project: "Baby Boss",        kind: "multi" },
    { month: "November",  monthIndex: 10, calendarYear: 2026, project: "Visil",            kind: "signature", slug: "visil" },
    { month: "December",  monthIndex: 11, calendarYear: 2026, project: "Fashion to Funds", kind: "community" },
    { month: "January",   monthIndex: 0,  calendarYear: 2027, project: "Vawez",            kind: "signature", slug: "vawez" },
    { month: "February",  monthIndex: 1,  calendarYear: 2027, project: "Valentine's Week", kind: "multi" },
    { month: "March",     monthIndex: 2,  calendarYear: 2027, project: "Charter Day",      kind: "multi" },
    { month: "April",     monthIndex: 3,  calendarYear: 2027, project: "Vannangal",        kind: "signature", slug: "vannangal" },
    { month: "May",       monthIndex: 4,  calendarYear: 2027, project: "Last Dance",       kind: "club" },
    { month: "June",      monthIndex: 5,  calendarYear: 2027, project: "DRR Visit",        kind: "district" },
];

export function YearPlanTimeline() {
    // Server-rendered; the page revalidates every 60s, so "this month" stays
    // honest without a client component or a hydration mismatch.
    const now = new Date();
    const currentIndex = YEAR_PLAN.findIndex(
        (e) => e.monthIndex === now.getMonth() && e.calendarYear === now.getFullYear()
    );

    return (
        <section id="year-plan" aria-labelledby="year-plan-heading">
            <div className="mb-10 md:mb-14">
                <h2
                    id="year-plan-heading"
                    className="font-heading text-step-3 font-extrabold text-text-primary tracking-tight"
                >
                    2026–27{" "}
                    <span className="font-display-drama text-gold-ink font-light">year plan</span>
                </h2>
                <p className="mt-3 text-step-0 text-text-secondary measure">
                    One flagship project a month across the Rotary year, July through June.
                    Four of the twelve are the club&apos;s signature projects.
                </p>
            </div>

            <ol className="relative pl-8 lg:pl-0">
                {/* The spine. Left-aligned on small screens, centred once there
                    is room for entries either side of it. */}
                <span
                    className="absolute top-2 bottom-2 left-[4px] lg:left-1/2 w-px bg-white/12 lg:-translate-x-1/2"
                    aria-hidden
                />

                {YEAR_PLAN.map((entry, i) => {
                    const isCurrent = i === currentIndex;
                    const isSignature = entry.kind === "signature";
                    // Alternate sides on lg+. Odd entries cross to the right.
                    const rightSide = i % 2 === 1;

                    const body = (
                        <>
                            <p
                                className={`font-mono text-[10px] uppercase tracking-[0.24em] ${
                                    isCurrent ? "text-cranberry-ink" : "text-text-secondary"
                                }`}
                            >
                                {entry.month} {entry.calendarYear}
                                {isCurrent && " · This month"}
                            </p>
                            <p
                                className={`mt-1.5 font-heading font-bold text-step-1 leading-snug ${
                                    isSignature ? "text-gold-ink" : "text-text-primary"
                                }`}
                            >
                                {entry.project}
                            </p>
                            <p className="mt-1 text-step--1 text-text-secondary">
                                {KIND_LABEL[entry.kind]}
                            </p>
                        </>
                    );

                    return (
                        <li
                            key={`${entry.month}-${entry.project}`}
                            className="relative grid lg:grid-cols-2 lg:gap-x-16"
                        >
                            {/* Node. Sits on the spine at every breakpoint. */}
                            <span
                                className={`absolute top-6 left-[4px] lg:left-1/2 -translate-x-1/2 rounded-full ${
                                    isCurrent
                                        ? "w-2.5 h-2.5 bg-accent-cranberry ring-4 ring-accent-cranberry/20"
                                        : isSignature
                                          ? "w-2 h-2 bg-accent-gold"
                                          : "w-1.5 h-1.5 bg-white/35"
                                }`}
                                aria-hidden
                            />

                            <div
                                className={
                                    rightSide
                                        ? "lg:col-start-2 lg:pl-16"
                                        : "lg:col-start-1 lg:text-right lg:pr-16"
                                }
                            >
                                {entry.slug ? (
                                    <Link
                                        href={`/initiatives/${entry.slug}`}
                                        // min-h keeps the tap target comfortably past 44px
                                        className="block py-4 min-h-[44px] rounded-xl transition-colors duration-300 hover:bg-white/[0.03] -mx-3 px-3"
                                    >
                                        {body}
                                    </Link>
                                ) : (
                                    <div className="py-4">{body}</div>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}
