"use client";

import { useState } from "react";
import { toggleRSVP } from "@/lib/server-actions";
import { Check, X } from "lucide-react";

type EventRSVPProps = {
    eventId: string;
    initialStatus: 'attending' | 'apologies' | null;
};

export const EventRSVP = ({ eventId, initialStatus }: EventRSVPProps) => {
    const [status, setStatus] = useState<'attending' | 'apologies' | null>(initialStatus);
    const [loading, setLoading] = useState(false);

    const handleToggle = async (newStatus: 'attending' | 'apologies') => {
        setLoading(true);
        const result = await toggleRSVP(eventId, status);
        if (result.success) {
            setStatus(newStatus === status ? null : newStatus);
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
            <button
                onClick={() => handleToggle('attending')}
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${status === 'attending'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-white/5 text-text-secondary border border-transparent hover:bg-white/10'
                    }`}
            >
                <Check size={16} />
                RSVP
            </button>
            <button
                onClick={() => handleToggle('apologies')}
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${status === 'apologies'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-white/5 text-text-secondary border border-transparent hover:bg-white/10'
                    }`}
            >
                <X size={16} />
                Apologies
            </button>
        </div>
    );
};
