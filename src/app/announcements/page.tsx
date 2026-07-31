import { getPublicAnnouncements } from "@/lib/actions";
import { AnnouncementCard } from "@/components/announcement-card";

export const revalidate = 60;

export default async function AnnouncementsPage() {
    const announcements = await getPublicAnnouncements();

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-5xl mx-auto">
            <div className="mb-12 max-w-2xl">
                <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight text-balance">
                    Notices
                </h1>
                <p className="mt-3 text-text-secondary leading-relaxed">
                    Public announcements from the board. Members may see additional notes after sign-in.
                </p>
            </div>

            {announcements.length > 0 ? (
                <div className="space-y-6">
                    {announcements.map(
                        (
                            a: {
                                id: string;
                                title: string;
                                content: string;
                                tag: string;
                                visibility: string;
                                is_pinned: boolean;
                                created_at: string;
                            },
                            i: number
                        ) => (
                            <AnnouncementCard key={a.id} announcement={a} index={i} />
                        )
                    )}
                </div>
            ) : (
                <div className="py-20 text-center text-text-secondary text-sm rounded-3xl border border-white/8 bg-white/[0.02]">
                    No public notices yet. Check back after the board posts.
                </div>
            )}
        </div>
    );
}
