import { getPublicAnnouncements } from "@/lib/actions";
import { AnnouncementCard } from "@/components/announcement-card";

export const revalidate = 60; // ISR — revalidate every 60s

export default async function AnnouncementsPage() {
    const announcements = await getPublicAnnouncements();

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-5xl mx-auto">
            <div className="mb-16">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold mb-4">Latest from the Club</p>
                <h1 className="font-heading text-5xl md:text-7xl font-bold text-text-primary">
                    Announcements <span className="font-drama italic gold-text font-light block text-6xl md:text-8xl mt-1">& Updates</span>
                </h1>
            </div>

            {announcements.length > 0 ? (
                <div className="space-y-6">
                    {announcements.map((a: { id: string; title: string; content: string; tag: string; visibility: string; is_pinned: boolean; created_at: string }, i: number) => (
                        <AnnouncementCard key={a.id} announcement={a} index={i} />
                    ))}
                </div>
            ) : (
                <div className="py-32 text-center text-text-secondary font-mono glass-panel rounded-3xl">
                    No announcements yet. Check back soon.
                </div>
            )}
        </div>
    );
}
