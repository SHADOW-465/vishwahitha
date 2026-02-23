"use client";

import { useState } from "react";
import { createBroadcast } from "@/lib/server-actions";
import { Send } from "lucide-react";

export const BroadcastCenter = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setSuccess(false);

        const result = await createBroadcast(formData);

        if (result.success) {
            setSuccess(true);
            (document.getElementById("broadcast-form") as HTMLFormElement)?.reset();
        }
        setLoading(false);
    }

    return (
        <div className="glass-panel p-8 rounded-[2rem]">
            <div className="mb-6">
                <h2 className="text-2xl font-heading font-bold text-text-primary">Broadcast Center</h2>
                <p className="font-mono text-sm text-text-secondary mt-1">Push new announcements to the member Hub.</p>
            </div>

            <form id="broadcast-form" action={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-mono text-text-secondary mb-2">Subject Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-cranberry transition-colors placeholder:text-white/20"
                        placeholder="e.g. Next General Meeting Details"
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-mono text-text-secondary mb-2">Message Content</label>
                    <textarea
                        id="content"
                        name="content"
                        required
                        rows={4}
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-text-primary focus:outline-none focus:border-accent-cranberry transition-colors resize-none placeholder:text-white/20"
                        placeholder="Write your announcement here..."
                    ></textarea>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            id="isUrgent"
                            name="isUrgent"
                            className="peer appearance-none w-5 h-5 border border-white/20 rounded bg-white/5 checked:bg-accent-cranberry checked:border-accent-cranberry transition-colors cursor-pointer"
                        />
                        <div className="pointer-events-none absolute inset-0 hidden peer-checked:flex items-center justify-center text-white text-xs">
                            ✓
                        </div>
                    </div>
                    <label htmlFor="isUrgent" className="text-sm font-mono text-text-primary cursor-pointer select-none">
                        Mark as <span className="text-accent-cranberry font-bold">URGENT</span> priority
                    </label>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/10">
                    <p className="text-sm font-mono text-green-400">
                        {success ? "Broadcast sent successfully." : ""}
                    </p>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-text-primary text-primary px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-white/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Transmitting..." : "Send Broadcast"}
                        {!loading && <Send size={16} />}
                    </button>
                </div>
            </form>
        </div>
    );
};
