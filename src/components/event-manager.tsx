"use client";

import { useState } from "react";
import { createEvent } from "@/lib/server-actions";
import { Plus, Calendar, MapPin, Globe, Lock } from "lucide-react";

export const EventManager = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setSuccess(false);
        const result = await createEvent(formData);
        if (result.success) {
            setSuccess(true);
            (document.getElementById("event-form") as HTMLFormElement)?.reset();
        }
        setLoading(false);
    }

    return (
        <div className="glass-panel p-8 rounded-[2rem]">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-text-primary">Event Manager</h2>
                    <p className="font-mono text-sm text-text-secondary mt-1">Schedule and manage club engagements.</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl text-accent-gold">
                    <Plus size={24} />
                </div>
            </div>

            <form id="event-form" action={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-text-secondary uppercase tracking-widest pl-1">Event Title</label>
                        <input
                            name="title"
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold transition-colors"
                            placeholder="e.g. Installation Ceremony"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-text-secondary uppercase tracking-widest pl-1">Date & Time</label>
                        <input
                            name="date"
                            type="datetime-local"
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-gold transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-text-secondary uppercase tracking-widest pl-1">Location</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                            <input
                                name="location"
                                required
                                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-text-primary focus:outline-none focus:border-accent-gold transition-colors"
                                placeholder="Venue name"
                            />
                        </div>
                    </div>
                    <div className="flex items-end pb-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    name="isPublic"
                                    defaultChecked
                                    className="peer appearance-none w-6 h-6 border border-white/20 rounded-lg bg-white/5 checked:bg-accent-gold checked:border-accent-gold transition-all"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity text-primary">
                                    <Globe size={14} />
                                </div>
                            </div>
                            <span className="text-sm font-mono text-text-secondary group-hover:text-text-primary transition-colors">
                                Make this event <span className="text-accent-gold font-bold">Public</span>
                            </span>
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-mono text-text-secondary uppercase tracking-widest pl-1">Description</label>
                    <textarea
                        name="description"
                        rows={3}
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-text-primary focus:outline-none focus:border-accent-gold transition-colors resize-none"
                        placeholder="Key details, speakers, or agenda..."
                    />
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/10">
                    <p className="text-sm font-mono text-green-400">
                        {success ? "Event successfully scheduled." : ""}
                    </p>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-accent-gold text-primary px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
                    >
                        {loading ? "Scheduling..." : "Create Event"}
                        {!loading && <Calendar size={18} />}
                    </button>
                </div>
            </form>
        </div>
    );
};
