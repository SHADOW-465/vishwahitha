export default function GalleryPage() {
    return (
        <div className="min-h-screen pt-32 px-6 max-w-7xl mx-auto">
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-text-primary mb-12">
                Visual <span className="text-accent-gold italic font-drama font-light text-6xl md:text-8xl">Archive</span>
            </h1>

            {/* Masonry CSS Grid Simulation with some placeholder boxes */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {[400, 300, 500, 350, 450, 300].map((h, i) => (
                    <div
                        key={i}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse"
                        style={{ height: `${h}px` }}
                    />
                ))}
            </div>
        </div>
    );
}
