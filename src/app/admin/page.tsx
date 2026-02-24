import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { EventManager } from "@/components/event-manager";

export default async function AdminPage() {
    const { sessionClaims, userId } = await auth();

    // Strict RBAC using session metadata
    const role = (sessionClaims?.metadata as any)?.role;

    if (!userId || role !== "admin") {
        redirect("/");
    }

    // Fetch dynamic content
    const [{ data: feedback }, { data: gallery }] = await Promise.all([
        supabase.from("feedback").select("*").order("created_at", { ascending: false }),
        supabase.from("gallery_media").select("*").order("created_at", { ascending: false })
    ]);

    return (
        <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-primary leading-tight">
                        Board <span className="text-accent-cranberry italic font-drama font-light block md:inline mt-2 md:mt-0">Command</span>
                    </h1>
                    <p className="font-mono text-text-secondary mt-4 max-w-xl">
                        Administrative access granted. Manage club media, events, and view weekly pulse feedback.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Event Management & Broadcasting */}
                <div className="space-y-8">
                    <EventManager />

                    <div className="glass-panel p-8 rounded-[2rem] border-accent-gold/20">
                        <h3 className="font-heading text-xl font-bold text-text-primary mb-2 flex items-center gap-2">
                            Event Broadcaster
                        </h3>
                        <p className="font-mono text-xs text-text-secondary mb-6">Dispatch personalized event invites to all verified members via Resend (Email) and Twilio (WhatsApp).</p>

                        <form action="/api/broadcast" method="POST" className="space-y-4">
                            <input type="text" name="message" placeholder="Custom message (e.g., Join us this Friday!)" required className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold transition-colors" />
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 font-mono text-sm">
                                    <input type="checkbox" name="channels" value="email" defaultChecked className="accent-accent-gold" /> Email
                                </label>
                                <label className="flex items-center gap-2 font-mono text-sm">
                                    <input type="checkbox" name="channels" value="whatsapp" defaultChecked className="accent-accent-gold" /> WhatsApp
                                </label>
                            </div>
                            <button type="submit" className="w-full bg-accent-gold text-primary py-3 rounded-full text-sm font-bold mt-2 hover:brightness-110 transition-all">
                                Send Broadcast 🚀
                            </button>
                        </form>
                    </div>
                </div>

                {/* Feedback & Gallery */}
                <div className="space-y-8">
                    {/* Weekly Pulse Feedback Reader */}
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
                        <h3 className="font-heading text-xl font-bold text-text-primary mb-6">Weekly Pulse</h3>
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {feedback?.map((fb) => (
                                <div key={fb.id} className="p-4 rounded-xl bg-black/40 border border-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-full ${fb.type === 'pulse' ? 'bg-accent-cranberry/10 text-accent-cranberry' : 'bg-accent-gold/10 text-accent-gold'}`}>
                                            {fb.type}
                                        </span>
                                        <span className="text-[10px] text-text-secondary font-mono">
                                            {new Date(fb.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-text-primary">{fb.content}</p>
                                    <p className="text-xs text-text-secondary mt-2 font-mono">
                                        From: {fb.is_anonymous ? 'Anonymous' : (fb.member_id || 'Unknown')}
                                    </p>
                                </div>
                            ))}
                            {feedback?.length === 0 && <p className="text-text-secondary font-mono text-sm">No feedback received yet.</p>}
                        </div>
                    </div>

                    {/* Gallery Manager */}
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8">
                        <h3 className="font-heading text-xl font-bold text-text-primary mb-2">Gallery Manager</h3>
                        <p className="font-mono text-xs text-text-secondary mb-6">Upload photos and videos directly to the Club Media bucket.</p>

                        {/* Note: Real upload requires a Client Component for File APIs. This is a placeholder UI for the server component */}
                        <div className="border border-dashed border-white/20 rounded-xl p-8 text-center text-text-secondary font-mono text-sm bg-black/20 hover:bg-white/5 transition-colors cursor-pointer">
                            Drag & Drop media here, or click to select files.
                            <br />
                            <span className="text-xs opacity-50 block mt-2">(Requires connecting standard Supabase Storage JS Client in a dedicated Upload component)</span>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-3">
                            {gallery?.map((item) => (
                                <div key={item.id} className="aspect-square bg-black/50 rounded-lg border border-white/10 overflow-hidden relative group">
                                    {/* Placeholder for actual image rendering */}
                                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <span className="text-xs font-mono font-bold">Delete</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
