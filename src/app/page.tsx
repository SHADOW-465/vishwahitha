import { Hero } from "@/components/hero";
import { ProjectShuffler } from "@/components/project-shuffler";
import { LiveEventCalendar } from "@/components/live-event-calendar";
import { SponsorShowcase } from "@/components/sponsor-showcase";
import { getInitiatives } from "@/lib/actions";

export default async function Home() {
    const initiatives = await getInitiatives();

    return (
        <main className="min-h-screen pb-32">
            <Hero />
            <ProjectShuffler initiatives={initiatives} />
            <LiveEventCalendar />
            <SponsorShowcase />
        </main>
    );
}
