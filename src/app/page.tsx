/* Hallmark · macrostructure: Club Newspaper (Long Document story beats)
 * tone: luxury-editorial · theme: DESIGN.md Midnight Cranberry & Gold
 * audience: public + Rotaracters + officials · use: join + prove activity
 * enrichment: none · nav: existing floating pill · footer: existing
 * beats: Hook · Now · Proof · Legacy · People · FAQ · Join
 */
import { Hero } from "@/components/hero";
import { ClubBulletin } from "@/components/club-bulletin";
import { LegacyTimeline } from "@/components/legacy-timeline";
import { WhoWeAre } from "@/components/who-we-are";
import { FeaturedBento } from "@/components/featured-bento";
import { JoinMission } from "@/components/join-mission";
import { FAQSection } from "@/components/faq-section";
import { getPageSection } from "@/lib/actions";

export const revalidate = 60;

export default async function Home() {
    const [heroHeadline, heroSubtext] = await Promise.all([
        getPageSection("hero_headline"),
        getPageSection("hero_subtext"),
    ]);

    return (
        <main className="min-h-screen bg-primary overflow-x-clip">
            {/* 1 · HOOK */}
            <Hero
                headlineLine1={heroHeadline?.line1 || "Rotaract Club of Vishwahita"}
                headlineLine2={heroHeadline?.line2 || "27 years of youth-led service in Chennai."}
                subtext={
                    heroSubtext?.text ||
                    "Chartered 10 March 1999 · Sponsored by the Rotary Club of Madras Industrial City · District 3234. One club, real projects, a clear path to join."
                }
            />

            {/* 2 · NOW — bulletin: events + announcements */}
            <ClubBulletin />

            {/* 3 · PROOF — signature work */}
            <FeaturedBento />

            {/* 4 · LEGACY — charter arc */}
            <LegacyTimeline />

            {/* 5 · PEOPLE — who you'll meet / what we stand for */}
            <WhoWeAre />

            {/* 6 · JOIN friction */}
            <FAQSection />

            {/* 7 · JOIN CTA */}
            <JoinMission />
        </main>
    );
}
