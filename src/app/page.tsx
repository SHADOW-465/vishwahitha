/* The Charter Ledger — five acts, not twelve sections.
 *
 * I.   Charter   — who this club is, on the record
 * II.  This week — what is live right now
 * III. The work  — proof, image-led
 * IV.  The club  — mission, people, milestones
 * V.   Join      — the one ask
 *
 * The ChapterRail names the act you're in, so no section needs its own
 * uppercase kicker to announce itself.
 */
import { BrandIntro } from "@/components/brand-intro";
import { Hero } from "@/components/hero";
import { OfficialStanding } from "@/components/official-standing";
import { ClubBulletin } from "@/components/club-bulletin";
import { EventsCarousel } from "@/components/events-carousel";
import { FeaturedBento } from "@/components/featured-bento";
import { LegacySpotlight } from "@/components/legacy-spotlight";
import { BoardStrip } from "@/components/board-strip";
import { GalleryTeaser } from "@/components/gallery-teaser";
import { MissionAvenues } from "@/components/mission-avenues";
import { MilestonesStrip } from "@/components/milestones-strip";
import { FAQSection } from "@/components/faq-section";
import { JoinSection } from "@/components/join-section";
import { ChapterRail, type Act } from "@/components/ui/chapter-rail";
import { getPageSection } from "@/lib/actions";

export const revalidate = 60;

const ACTS: Act[] = [
    { id: "act-charter", label: "Charter" },
    { id: "act-now", label: "This week" },
    { id: "act-work", label: "The work" },
    { id: "act-club", label: "The club" },
    { id: "act-join", label: "Join" },
];

export default async function Home() {
    const [heroHeadline, heroSubtext] = await Promise.all([
        getPageSection("hero_headline"),
        getPageSection("hero_subtext"),
    ]);

    return (
        <>
            <BrandIntro />
            <ChapterRail acts={ACTS} />

            {/* xl:pl-28 is the ledger gutter — it keeps the rail clear of the
                content instead of overlapping it at 1280–1440px. */}
            <main className="min-h-screen bg-primary overflow-x-clip xl:pl-28">
                {/* ── I · CHARTER ───────────────────────────────────
                    Holds the fold alone, then lands on the registry line. */}
                <section id="act-charter" aria-label="Charter">
                    <Hero
                        headlineLine1={
                            heroHeadline?.line1 || "Rotaract Club of Vishwahita:"
                        }
                        headlineLine2={
                            heroHeadline?.line2 || "27 Years of Youth-Led Service in Chennai."
                        }
                        subtext={
                            heroSubtext?.text ||
                            "Chartered 10 March 1999 · Sponsored by the Rotary Club of Madras Industrial City · District 3234. One club, real projects, a clear path to join."
                        }
                    />
                    <OfficialStanding />
                </section>

                {/* ── II · THIS WEEK ────────────────────────────────
                    Tightest act on the page. It's a bulletin; it should feel
                    like one — quick, dense, current. */}
                <section id="act-now" aria-label="This week" className="pt-act-lead">
                    <ClubBulletin />
                    <div className="pt-act-lead pb-act-beat">
                        <EventsCarousel />
                    </div>
                </section>

                {/* ── III · THE WORK ────────────────────────────────
                    The longest act, and the only image-led one. Opens on one
                    flagship project full-bleed before the programme grid. */}
                <section id="act-work" aria-label="The work" className="pt-act-lead">
                    <LegacySpotlight />
                    <div className="pt-act-lead">
                        <FeaturedBento />
                    </div>
                    <div className="pt-act-lead">
                        <GalleryTeaser />
                    </div>
                </section>

                {/* ── IV · THE CLUB ─────────────────────────────────
                    Slows down: what the club believes, who runs it, what it
                    has already done. */}
                <section id="act-club" aria-label="The club" className="pt-act-lead">
                    <MissionAvenues />
                    <div className="pt-act-lead">
                        <BoardStrip />
                    </div>
                    <div className="pt-act-lead">
                        <MilestonesStrip />
                    </div>
                </section>

                {/* ── V · JOIN ──────────────────────────────────────
                    Answer the objections, then make the single ask. */}
                <section id="act-join" aria-label="Join" className="pt-act-lead pb-act-lead">
                    <FAQSection />
                    <div className="pt-act-lead">
                        <JoinSection />
                    </div>
                </section>
            </main>
        </>
    );
}
