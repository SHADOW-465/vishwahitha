import { Hero } from "@/components/hero";
import { ProjectShuffler } from "@/components/project-shuffler";
import { LiveEventCalendar } from "@/components/live-event-calendar";

export default function Home() {
    return (
        <main className="min-h-screen pb-32">
            <Hero />
            <ProjectShuffler />
            <LiveEventCalendar />
        </main>
    );
}
