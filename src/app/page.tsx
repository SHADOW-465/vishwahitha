import { Hero } from "@/components/hero";
import { ProjectShuffler } from "@/components/project-shuffler";
import { LiveEventCalendar } from "@/components/live-event-calendar";
import { SponsorShowcase } from "@/components/sponsor-showcase";
import { LiveImpactDashboard } from "@/components/live-impact-dashboard";

export default function Home() {
    return (
        <main className="min-h-screen pb-32">
            <Hero />
            <ProjectShuffler />
            <LiveEventCalendar />
            <SponsorShowcase />
            <LiveImpactDashboard />
        </main>
    );
}
