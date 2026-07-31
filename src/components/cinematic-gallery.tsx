"use client";

/**
 * Legacy demo gallery (not mounted on public house).
 * Real photos live in Supabase gallery_media — use /gallery + GalleryTeaser.
 * Stock Unsplash dataset removed for honest content rules.
 */
export const CinematicGallery = () => {
    return (
        <section className="py-24 px-6 w-full max-w-7xl mx-auto border-t border-white/5">
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-text-primary tracking-tight">
                Gallery
            </h2>
            <p className="mt-3 text-sm text-text-secondary max-w-md leading-relaxed">
                No demo photos. Open the public gallery for board-published media, or upload under Admin when
                available.
            </p>
            <a
                href="/gallery"
                className="inline-block mt-6 font-mono text-xs text-accent-gold hover:underline"
            >
                Open gallery →
            </a>
        </section>
    );
};
