/* Hallmark · Phase 1 Public House
 * beats: Intro · Hook · Standing · Now · Events · Signature · Legacy · Board · Gallery · Mission · FAQ · Join
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
import { getPageSection } from "@/lib/actions";

export const revalidate = 60;

export default async function Home() {
    const [heroHeadline, heroSubtext] = await Promise.all([
        getPageSection("hero_headline"),
        getPageSection("hero_subtext"),
    ]);

    return (
        <>
            <BrandIntro />
            <main className="min-h-screen bg-primary overflow-x-clip">
                {/* 1 · HOOK */}
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

                {/* 2 · OFFICIAL STANDING */}
                <OfficialStanding />

                {/* 3 · NOW — bulletin */}
                <ClubBulletin />

                {/* 4 · EVENTS CAROUSEL */}
                <EventsCarousel />

                {/* 5 · SIGNATURE PROJECTS */}
                <FeaturedBento />

                {/* 6 · LEGACY SPOTLIGHT */}
                <LegacySpotlight />

                {/* 7 · BOARD */}
                <BoardStrip />

                {/* 8 · GALLERY (only if photos exist) */}
                <GalleryTeaser />

                {/* 9 · MISSION + AVENUES */}
                <MissionAvenues />

                {/* 10 · MILESTONES (CMS) */}
                <MilestonesStrip />

                {/* 11 · FAQ */}
                <FAQSection />

                {/* 12 · JOIN + PROSPECT FORM */}
                <JoinSection />
            </main>
        </>
    );
}
