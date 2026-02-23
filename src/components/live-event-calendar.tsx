import { getPublicEvents } from "@/lib/actions";
import { MagneticButton } from "./ui/magnetic-button";
import Link from "next/link";

export const LiveEventCalendar = async () => {
    const events = await getPublicEvents();

    // Fallback stub data if the database is empty or unreachable during dev
    const displayEvents = events && events.length > 0 ? events : [
        {
            id: "1",
            title: "Vaagai Phase 3 Launch",
            date: new Date(Date.now() + 86400000 * 2).toISOString(),
            location: "Community Center",
        },
        {
            id: "2",
            title: "INDRU Strategy Meet",
            date: new Date(Date.now() + 86400000 * 5).toISOString(),
            location: "HQ Boardroom",
        }
    ];

    return (
        <section className="py-24 px-6 w-full max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8">
                <div>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-text-primary">
                        Upcoming <span className="text-accent-gold font-drama italic font-light">Engagements</span>
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayEvents.map((event: any) => (
                    <div
                        key={event.id}
                        className="group glass-panel rounded-[2rem] p-8 flex flex-col justify-between h-full min-h-[250px] transition-transform duration-300 hover:-translate-y-1"
                    >
                        <div>
                            <p className="text-accent-cranberry font-mono text-sm tracking-widest mb-2">
                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                {" • "}
                                {new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <h3 className="text-2xl font-heading font-bold text-text-primary mb-2 line-clamp-2">
                                {event.title}
                            </h3>
                            <p className="text-text-secondary font-mono text-sm">
                                @ {event.location}
                            </p>
                        </div>

                        <div className="mt-8">
                            <MagneticButton>
                                <Link href={`/events/${event.id}`} className="text-text-primary text-sm font-bold border border-white/20 rounded-full px-5 py-2 inline-block hover:bg-white/10 transition-colors">
                                    Learn More
                                </Link>
                            </MagneticButton>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
