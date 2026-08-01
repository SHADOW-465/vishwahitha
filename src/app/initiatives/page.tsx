import { getInitiatives } from "@/lib/actions";
import { InitiativesClient } from "@/components/initiatives-client";

export const revalidate = 0;

export default async function InitiativesPage() {
    const initiatives = await getInitiatives();

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-16 space-y-4">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold">Our Work</p>
                <h1 className="font-heading text-5xl md:text-7xl font-bold text-text-primary tracking-tighter">
                    Active <span className="font-drama italic gold-text text-6xl md:text-8xl">Initiatives</span>
                </h1>
                <p className="font-mono text-text-secondary max-w-xl leading-relaxed">
                    Every initiative is a deliberate commitment to our community. Each one has a story, a team, and a measurable impact.
                </p>
            </div>

            <InitiativesClient initiatives={initiatives} />
        </div>
    );
}
