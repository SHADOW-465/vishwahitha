"use client";

import { AlertCircle } from "lucide-react";

export const EmergencyRequestForm = () => {
    return (
        <div className="bg-surface border border-accent-cranberry/30 rounded-3xl p-8 backdrop-blur-sm shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cranberry/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30 animate-pulse">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-heading font-bold text-white">Emergency Request</h3>
                        <p className="text-red-300 font-mono text-sm mt-1">Broadcast an urgent need for blood.</p>
                    </div>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <label className="text-sm font-mono text-red-300/70 uppercase tracking-widest">Required Blood Group</label>
                        <select className="w-full bg-primary/50 border border-accent-cranberry/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors appearance-none" required>
                            <option value="">Select Target Group</option>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-mono text-red-300/70 uppercase tracking-widest">Hospital & Location</label>
                        <input type="text" className="w-full bg-primary/50 border border-accent-cranberry/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" placeholder="e.g., Apollo Hospital, Greams Road" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-mono text-red-300/70 uppercase tracking-widest">Contact Number</label>
                        <input type="tel" className="w-full bg-primary/50 border border-accent-cranberry/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors" placeholder="Emergency Contact" required />
                    </div>

                    <button type="submit" className="w-full mt-6 bg-red-600 text-white font-bold font-heading py-4 rounded-xl hover:bg-red-500 transition-colors shadow-lg shadow-red-600/30">
                        Broadcast Emergency Alert
                    </button>
                    <p className="text-xs text-center text-red-400 font-mono mt-4">This will instantly notify nearby registered donors via SMS/WhatsApp.</p>
                </form>
            </div>
        </div>
    );
};
