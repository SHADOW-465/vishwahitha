import { Hero } from "@/components/hero";
import { LiveClubStatus } from "@/components/live-club-status";
import { LegacyTimeline } from "@/components/legacy-timeline";
import { WhoWeAre } from "@/components/who-we-are";
import { FeaturedBento } from "@/components/featured-bento";
import { LiveEventCalendar } from "@/components/live-event-calendar";
import { DailyAffirmation } from "@/components/daily-affirmation";
import { ImpactStatsSection } from "@/components/impact-counter";
import { CinematicGallery } from "@/components/cinematic-gallery";
import { MembershipTiers } from "@/components/membership-tiers";
import { JoinMission } from "@/components/join-mission";
import { getPageSection } from "@/lib/actions";

export const revalidate = 60; // Revalidate dynamic content every 60 seconds

export default async function Home() {
    // Fetch data in parallel on the server
    const [
        heroHeadline,
        heroSubtext,
        dailyAffirmation
    ] = await Promise.all([
        getPageSection("hero_headline"),
        getPageSection("hero_subtext"),
        getPageSection("daily_affirmation")
    ]);

    return (
        <main className="min-h-screen bg-primary overflow-x-hidden">
            {/* Section 1: Hero */}
            <Hero
                headlineLine1={heroHeadline?.line1 || "27 Years of Youth-Led Service meets"}
                headlineLine2={heroHeadline?.line2 || "Impact."}
                subtext={heroSubtext?.text || "Welcome to the Digital Home of Rotaract Vishwahita. Fostering leaders, building lifelong fellowship, and driving sustainable service in Chennai."}
            />

            {/* Section 2: Live Club Status */}
            <LiveClubStatus />

            {/* Section 3: Legacy Timeline */}
            <LegacyTimeline />

            {/* Section 4: Who We Are (Split Storytelling) */}
            <WhoWeAre />

            {/* Section 5: Projects (Bento Grid) */}
            <FeaturedBento />

            {/* Section 5b: Live Events */}
            <LiveEventCalendar />

            {/* Section 6: Daily Inspiration */}
            <DailyAffirmation 
                initialQuote={dailyAffirmation?.quote}
                initialChallenge={dailyAffirmation?.challenge}
            />

            {/* Section 7: Impact (Counter with dot-generated Rotary gear) */}
            <ImpactStatsSection />

            {/* Section 8: Cinematic Gallery */}
            <CinematicGallery />

            {/* Section 9: Membership */}
            <MembershipTiers />

            {/* Section 9b: Admissions Call to Action */}
            <JoinMission />

            {/* Section 10 is the Footer rendered globally in layout.tsx */}
        </main>
    );
}
