"use client";

import { Activity, MapPin } from "lucide-react";

const shortages = [
    { id: 1, bloodGroup: "O-", district: "Chennai, TN", severity: "Critical", unitsNeeded: 12 },
    { id: 2, bloodGroup: "AB-", district: "Madurai, TN", severity: "High", unitsNeeded: 8 },
    { id: 3, bloodGroup: "A-", district: "Coimbatore, TN", severity: "Moderate", unitsNeeded: 5 },
    { id: 4, bloodGroup: "B-", district: "Trichy, TN", severity: "High", unitsNeeded: 7 },
];

export const ShortageDashboard = () => {
    return (
        <div className="bg-surface border border-white/5 rounded-3xl p-8 backdrop-blur-sm shadow-xl h-full">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent-gold/10 flex items-center justify-center border border-accent-gold/20">
                        <Activity className="w-6 h-6 text-accent-gold" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-heading font-bold text-text-primary">Live Shortages</h3>
                        <p className="text-text-secondary font-mono text-sm mt-1">Real-time district demands.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-accent-gold bg-accent-gold/10 px-3 py-1.5 rounded-full border border-accent-gold/20">
                    <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
                    Live Updates
                </div>
            </div>

            <div className="space-y-4">
                {shortages.map((item) => (
                    <div key={item.id} className="group p-4 rounded-2xl bg-primary border border-white/5 hover:border-accent-gold/30 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center font-heading font-bold text-xl text-text-primary border border-white/10 group-hover:border-accent-gold/50 transition-colors">
                                {item.bloodGroup}
                            </div>
                            <div>
                                <h4 className="text-text-primary font-bold flex items-center gap-1.5 text-sm md:text-base">
                                    <MapPin className="w-4 h-4 text-text-secondary" /> {item.district}
                                </h4>
                                <p className="text-text-secondary font-mono text-xs mt-1">Requires {item.unitsNeeded} units</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`text-xs font-mono px-3 py-1 rounded-full border ${item.severity === "Critical" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                    item.severity === "High" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                        "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                }`}>
                                {item.severity}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 bg-transparent border border-white/10 text-text-primary font-mono text-sm py-3 rounded-xl hover:bg-white/5 transition-colors">
                View Full Regional Map
            </button>
        </div>
    );
};
