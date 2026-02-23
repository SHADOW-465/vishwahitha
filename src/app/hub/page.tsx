import { MemberDirectory } from "@/components/member-directory";
import { DocumentRepository } from "@/components/document-repository";
import { EventRSVP } from "@/components/event-rsvp";

export default function HubPage() {
    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-12">
            <div className="glass-panel rounded-[2.5rem] p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <h1 className="font-heading text-4xl md:text-6xl font-bold text-text-primary leading-tight">
                            Member <span className="text-accent-gold italic font-drama font-light block md:inline mt-2 md:mt-0">Hub</span>
                        </h1>
                        <p className="font-mono text-text-secondary mt-4 max-w-xl">
                            Protected access for the Rotaract Club of Vishwahitha. Manage your engagements and access resources.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
                            <h3 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
                                Recent Announcements
                            </h3>

                            {/* Static Event for Demo */}
                            <div className="space-y-6">
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-[10px] font-mono text-accent-gold uppercase tracking-widest bg-accent-gold/10 px-3 py-1 rounded-full">Event Announcement</span>
                                        <span className="text-[10px] font-mono text-text-secondary">2 Hours Ago</span>
                                    </div>
                                    <h4 className="text-xl font-heading font-bold text-text-primary mb-2">Vaagai Phase 3: Launch Protocol</h4>
                                    <p className="text-sm text-text-secondary leading-relaxed">
                                        Join us for the final phase launch ceremony. All directors must be present in official club attire.
                                    </p>
                                    <EventRSVP eventId="demo-1" memberId="user-1" initialStatus={null} />
                                </div>
                            </div>
                        </section>

                        <MemberDirectory />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <DocumentRepository />

                        <form action={async (formData) => {
                            "use server";
                            const { submitFeedback } = await import("@/lib/server-actions");
                            await submitFeedback(formData);
                            // Optional: Add success state/toast logic here
                        }} className="glass-panel p-8 rounded-[2rem] bg-accent-cranberry/5 border-accent-cranberry/20">
                            <h3 className="font-heading text-xl font-bold text-text-primary mb-2">Direct Suggestion</h3>
                            <p className="text-xs font-mono text-text-secondary mb-6">Your ideas go directly to the Board for Weekly Pulse.</p>
                            <textarea
                                name="content"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-sm font-mono text-text-primary h-32 focus:outline-none focus:border-accent-cranberry transition-colors placeholder:text-white/20"
                                placeholder="Share your thoughts..."
                            />
                            <button type="submit" className="w-full mt-4 py-3 bg-text-primary text-primary rounded-full text-sm font-bold hover:bg-white/80 transition-colors">
                                Submit to Pulse
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
