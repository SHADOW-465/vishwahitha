/* Public house — thin story beats (critique 2026-07-31)
 * Hook · Standing · Now · Signature · Legacy · Board · Gallery · Join
 */
import { BrandIntro } from "@/components/brand-intro";
import { ScrollCinema } from "@/components/scroll-cinema";
import { Hero } from "@/components/hero";
import { OfficialStanding } from "@/components/official-standing";
import { ClubBulletin } from "@/components/club-bulletin";
import { FeaturedBento } from "@/components/featured-bento";
import { LegacySpotlight } from "@/components/legacy-spotlight";
import { BoardStrip } from "@/components/board-strip";
import { GalleryTeaser } from "@/components/gallery-teaser";
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
            <ScrollCinema />
            <main className="min-h-screen bg-primary overflow-x-clip">
                <Hero
                    headlineLine1={
                        heroHeadline?.line1 || "Rotaract Club of Vishwahita"
                    }
                    headlineLine2={
                        heroHeadline?.line2 || "Universal friendship, youth-led service."
                    }
                    subtext={
                        heroSubtext?.text ||
                        "Vishwahita means universal friendship. Young leaders in Chennai running real service under RI District 3234 — apply below and the board will follow up."
                    }
                />

                <div className="cinema-section">
                    <OfficialStanding />
                </div>

                <ClubBulletin />

                <div className="cinema-section">
                    <FeaturedBento />
                </div>

                <div className="cinema-section">
                    <LegacySpotlight />
                </div>

                <div className="cinema-section">
                    <BoardStrip />
                </div>

                <div className="cinema-section">
                    <GalleryTeaser />
                </div>

                <JoinSection />
            </main>
        </>
    );
}
