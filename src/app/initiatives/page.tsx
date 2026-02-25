import { getInitiatives } from "@/lib/actions";
import { InitiativeCard } from "@/components/initiative-card";

export default async function InitiativesPage() {
    const initiatives = await getInitiatives();

    const categories = ["All", ...Array.from(new Set(initiatives.map((i: { category: string }) => i.category)))];

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-16 space-y-4">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold">Our Work</p>
                <h1 className="font-heading text-5xl md:text-7xl font-bold text-text-primary tracking-tighter">
                    Active <span className="font-drama italic font-light gold-text text-6xl md:text-8xl">Initiatives</span>
                </h1>
                <p className="font-mono text-text-secondary max-w-xl leading-relaxed">
                    Every initiative is a deliberate commitment to our community. Each one has a story, a team, and a measurable impact.
                </p>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-3 mb-12">
                {categories.map((cat) => (
                    <span
                        key={cat}
                        className="font-mono text-xs uppercase tracking-widest border border-white/10 rounded-full px-4 py-2 text-text-secondary cursor-pointer hover:border-accent-gold/40 hover:text-text-primary transition-colors"
                    >
                        {cat}
                    </span>
                ))}
            </div>

            {/* Grid */}
            {initiatives.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {initiatives.map((initiative: { id: string; slug: string; title: string; category: string; short_description?: string; impact_stat?: string; impact_label?: string; color_class?: string; hero_image_url?: string }, i: number) => (
                        <InitiativeCard key={initiative.id} initiative={initiative} index={i} />
                    ))}
                </div>
            ) : (
                <div className="py-32 text-center text-text-secondary font-mono">
                    No initiatives found. Add them in the Admin panel.
                </div>
            )}
        </div>
    );
}
