"use client";

import { Droplets } from "lucide-react";

export const DonorRegistrationForm = () => {
    return (
        <div className="bg-surface border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent-cranberry/10 flex items-center justify-center border border-accent-cranberry/20">
                    <Droplets className="w-6 h-6 text-accent-cranberry" />
                </div>
                <div>
                    <h3 className="text-2xl font-heading font-bold text-text-primary">Register as a Donor</h3>
                    <p className="text-text-secondary font-mono text-sm mt-1">Join the Vishwahita lifesaver network.</p>
                </div>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 select-none md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-mono text-text-secondary uppercase tracking-widest">Full Name</label>
                        <input type="text" className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-cranberry transition-colors" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-mono text-text-secondary uppercase tracking-widest">Blood Group</label>
                        <select className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-cranberry transition-colors appearance-none" required>
                            <option value="">Select Group</option>
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-mono text-text-secondary uppercase tracking-widest">Phone Number</label>
                        <input type="tel" className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-cranberry transition-colors" placeholder="+91 XXXXX XXXXX" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-mono text-text-secondary uppercase tracking-widest">Location / District</label>
                        <input type="text" className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-cranberry transition-colors" placeholder="e.g., Chennai" required />
                    </div>
                </div>
                <button type="submit" className="w-full mt-6 bg-accent-cranberry text-white font-bold font-heading py-4 rounded-xl hover:bg-accent-cranberry/90 transition-colors shadow-lg shadow-accent-cranberry/20">
                    Join the Lifesavers Registry
                </button>
            </form>
        </div>
    );
};
