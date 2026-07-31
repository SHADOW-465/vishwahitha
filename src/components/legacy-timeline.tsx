"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronRight, Award, Compass, Zap } from "lucide-react";

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
    achievement: string;
    image: string;
    tag: string;
}

const timelineData: TimelineEvent[] = [
    {
        year: "1999",
        title: "Founding the Vision",
        description: "Rotaract Club of Vishwahita is officially chartered under Rotary International, pledging to serve the local community with dedicated youth leaders.",
        achievement: "Charter Night & First General Body Assembly",
        image: "",
        tag: "Foundation"
    },
    {
        year: "2005",
        title: "Sustained Regional Camps",
        description: "Initiated long-term medical checkups and blood donation networks across schools and community centers in Chennai.",
        achievement: "Community health and school hygiene programmes",
        image: "",
        tag: "Service"
    },
    {
        year: "2012",
        title: "Pioneering Leadership Forums",
        description: "Designed local training academies for public speech, career development, and leadership workshops for college students.",
        achievement: "Youth leadership forums in Chennai",
        image: "",
        tag: "Mentorship"
    },
    {
        year: "2018",
        title: "Chennai Relief Mobilization",
        description: "Deployed rapid-action volunteer networks for disaster response, helping distribute critical supplies and clean water.",
        achievement: "Flood relief mobilisation",
        image: "",
        tag: "Crisis Response"
    },
    {
        year: "2026",
        title: "Digital clubhouse",
        description: "Public house and member clubroom for events, RSVP, and board-managed content — one official home for District 3234 visitors and members.",
        achievement: "Official digital home launched",
        image: "",
        tag: "Evolution"
    }
];

export const LegacyTimeline = () => {
    const [activeIdx, setActiveIdx] = useState(4); // Default to current year (2026)
    const activeEvent = timelineData[activeIdx];

    return (
        <section id="legacy" className="py-24 px-6 w-full max-w-7xl mx-auto border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-text-primary tracking-tight text-balance">
                        From charter night to this term
                    </h2>
                </div>
                <p className="font-mono text-sm text-text-secondary max-w-md leading-relaxed">
                    Select a year to follow how Vishwahita&apos;s service in Chennai grew — not a museum wall, a living arc.
                </p>
            </div>

            {/* Timeline Year Select Bar */}
            <div className="relative mb-12 flex justify-between items-center max-w-4xl mx-auto px-4 md:px-12">
                {/* Connecting Line */}
                <div className="absolute left-12 right-12 top-1/2 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
                
                {/* Active Line Fill */}
                <motion.div 
                    className="absolute left-12 top-1/2 h-0.5 bg-accent-gold -translate-y-1/2 z-0 origin-left"
                    animate={{ width: `${(activeIdx / (timelineData.length - 1)) * 82}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                {timelineData.map((event, idx) => {
                    const isActive = idx === activeIdx;
                    const isPassed = idx < activeIdx;
                    return (
                        <button
                            key={event.year}
                            onClick={() => setActiveIdx(idx)}
                            className="relative z-10 flex flex-col items-center focus:outline-none group"
                        >
                            {/* Year Node Circle */}
                            <motion.div
                                className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${
                                    isActive
                                        ? "bg-primary border-accent-gold text-accent-gold shadow-lg shadow-accent-gold/20"
                                        : isPassed
                                        ? "bg-accent-gold border-accent-gold text-primary"
                                        : "bg-primary border-white/20 text-text-secondary group-hover:border-white/50"
                                }`}
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Calendar size={14} className={isActive ? "animate-pulse" : ""} />
                            </motion.div>
                            
                            {/* Year Text */}
                            <span
                                className={`absolute -bottom-7 font-mono text-xs md:text-sm font-semibold tracking-wider transition-colors duration-300 ${
                                    isActive ? "text-accent-gold" : "text-text-secondary group-hover:text-text-primary"
                                }`}
                            >
                                {event.year}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Detailed Expanded Section */}
            <div className="mt-16 w-full max-w-5xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIdx}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch bg-white/2 rounded-3xl overflow-hidden border border-white/5 p-6 md:p-8"
                    >
                        {/* Year panel — no stock photography */}
                        <div className="relative h-64 md:h-auto min-h-[280px] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-accent-gold/10 via-primary to-accent-cranberry/10 flex flex-col justify-between p-6">
                            <span className="font-heading text-6xl font-extrabold text-text-primary/20">
                                {activeEvent.year}
                            </span>
                            <span className="font-mono text-[10px] uppercase bg-accent-gold/15 text-accent-gold border border-accent-gold/25 rounded-full px-3 py-1 tracking-wider w-fit">
                                {activeEvent.tag}
                            </span>
                        </div>

                        {/* Text Details */}
                        <div className="flex flex-col justify-between py-2 space-y-6">
                            <div>
                                <span className="font-mono text-[10px] text-accent-gold tracking-[0.25em] uppercase">
                                    Highlight checkpoint
                                </span>
                                <h3 className="text-3xl font-heading font-extrabold text-text-primary mt-2">
                                    {activeEvent.title}
                                </h3>
                                <p className="text-sm md:text-base text-text-secondary leading-relaxed font-mono mt-4">
                                    {activeEvent.description}
                                </p>
                            </div>

                            {/* Core Achievement card */}
                            <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-3 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-accent-gold/5 blur-xl rounded-full" />
                                <div className="flex items-center gap-2 text-accent-gold">
                                    <Award size={16} />
                                    <span className="font-mono text-xs uppercase tracking-wider font-semibold">Milestone Accomplished</span>
                                </div>
                                <p className="font-heading font-bold text-sm md:text-base text-text-primary">
                                    {activeEvent.achievement}
                                </p>
                            </div>

                            {/* Navigation prompt */}
                            <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-secondary">
                                <Compass size={12} className="animate-spin-slow" />
                                <span>District 3234 Official Archive</span>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};
