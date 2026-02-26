import { Hero } from "@/components/hero";
import { ProjectShuffler } from "@/components/project-shuffler";
import { LiveEventCalendar } from "@/components/live-event-calendar";
import { SponsorShowcase } from "@/components/sponsor-showcase";
import { getInitiatives, getPageSection } from "@/lib/actions";

export default async function Home() {
    const [initiatives, heroHeadline, heroSubtext] = await Promise.all([
        getInitiatives(),
        getPageSection("hero_headline"),
        getPageSection("hero_subtext"),
    ]);

    return (
        <main className="min-h-screen pb-32">
            <Hero headline={heroHeadline ?? undefined} subtext={heroSubtext ?? undefined} />
            <ProjectShuffler initiatives={initiatives} />
            <LiveEventCalendar />
            <SponsorShowcase />
        </main>
    );
}
