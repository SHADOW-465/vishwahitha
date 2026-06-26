import { Hero } from "@/components/hero";
import { LiveClubStatus } from "@/components/live-club-status";
import { DailyAffirmation } from "@/components/daily-affirmation";
import { ImpactStatsSection } from "@/components/impact-counter";
import { LegacyTimeline } from "@/components/legacy-timeline";
import { FeaturedBento } from "@/components/featured-bento";
import { LiveProjectFeed } from "@/components/live-project-feed";
import { MemberSpotlight } from "@/components/member-spotlight";
import { CinematicGallery } from "@/components/cinematic-gallery";
import { JoinMission } from "@/components/join-mission";
import { getInitiatives, getPageSection } from "@/lib/actions";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // Revalidate dynamic content every 60 seconds

export default async function Home() {
    // Fetch data in parallel on the server
    const [
        initiatives,
        heroHeadline,
        heroSubtext,
        dailyAffirmation,
        { data: boardMembers }
    ] = await Promise.all([
        getInitiatives(),
        getPageSection("hero_headline"),
        getPageSection("hero_subtext"),
        getPageSection("daily_affirmation"),
        supabase.from("board_members").select("*").order("display_order")
    ]);

    return (
        <main className="min-h-screen bg-primary overflow-x-hidden">
            {/* 1. Cinematic Hero */}
            <Hero
                headlineLine1={heroHeadline?.line1 || "27 Years of Youth-Led Service meets"}
                headlineLine2={heroHeadline?.line2 || "Impact."}
                subtext={heroSubtext?.text || "Welcome to the Digital Home of Rotaract Vishwahita. Fostering leaders, building lifelong fellowship, and driving sustainable service in Chennai."}
            />

            {/* 2. Live Club Status */}
            <LiveClubStatus />

            {/* 3. The Daily Affirmation */}
            <DailyAffirmation 
                initialQuote={dailyAffirmation?.quote}
                initialChallenge={dailyAffirmation?.challenge}
            />

            {/* 4. Impact Counter */}
            <ImpactStatsSection />

            {/* 5. Legacy Timeline */}
            <LegacyTimeline />

            {/* 6. Featured Projects Bento Grid */}
            <FeaturedBento />

            {/* 7. Live Project Feed */}
            <LiveProjectFeed projects={initiatives} />

            {/* 8. Member Spotlight */}
            <MemberSpotlight members={boardMembers ?? []} />

            {/* 9. Cinematic Gallery */}
            <CinematicGallery />

            {/* 10. Join Rotaract */}
            <JoinMission />
        </main>
    );
}
