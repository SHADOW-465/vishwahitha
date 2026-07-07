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
        <section id="events" className="py-24 px-6 w-full max-w-7xl mx-auto border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div>
                    <span className="font-mono text-xs text-accent-cranberry uppercase tracking-[0.3em]">Operational Flow</span>
                    <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-text-primary tracking-tight mt-2">
                        Upcoming <span className="font-drama italic font-light gold-text">Engagements</span>
                    </h2>
                    <p className="font-mono text-sm text-text-secondary mt-3 max-w-md">
                        Join our upcoming General Body Meetings, community outreach runs, and district fellowship events in Chennai.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayEvents.map((event: any) => (
                    <div
                        key={event.id}
                        className="group glass-panel rounded-[2rem] p-8 flex flex-col justify-between h-full min-h-[250px] transition-transform duration-300 hover:-translate-y-1 hover:border-accent-cranberry/25"
                    >
                        <div>
                            <p className="text-accent-cranberry font-mono text-sm tracking-widest mb-2">
                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                {" • "}
                                {new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <h3 className="text-2xl font-heading font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-accent-cranberry transition-colors">
                                {event.title}
                            </h3>
                            <p className="text-text-secondary font-mono text-sm">
                                @ {event.location}
                            </p>
                        </div>

                        <div className="mt-8">
                            <MagneticButton>
                                <Link 
                                    href={`/events/${event.id}`} 
                                    className="text-text-primary text-xs font-mono border border-accent-cranberry/35 hover:border-accent-cranberry hover:bg-accent-cranberry/5 rounded-full px-5 py-2.5 inline-block transition-colors"
                                >
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
