"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MemberDirectory } from "./member-directory";
import { DocumentRepository } from "./document-repository";
import { AnnouncementCard } from "./announcement-card";
import { EventRSVP } from "./event-rsvp";

interface HubTabsProps {
    announcements: any[];
    members: any[];
    documents: any[];
    myRsvps: any[];
    activePulseForm: any;
    hasSubmittedPulse: boolean;
}

const TABS = ["Feed", "My Events", "Documents", "Directory", "Weekly Pulse"];

export const HubTabs = ({ announcements, members, documents, myRsvps, activePulseForm, hasSubmittedPulse }: HubTabsProps) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            {/* Tab bar */}
            <div className="flex gap-1 mb-8 bg-white/3 rounded-2xl p-1 overflow-x-auto">
                {TABS.map((tab, i) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(i)}
                        className={`relative flex-shrink-0 font-mono text-sm px-5 py-2.5 rounded-xl transition-colors duration-200 ${activeTab === i ? "text-primary font-bold" : "text-text-secondary hover:text-text-primary"
                            }`}
                    >
                        {activeTab === i && (
                            <motion.div
                                layoutId="tab-indicator"
                                className="absolute inset-0 bg-gradient-to-r from-accent-gold to-accent-gold-light rounded-xl"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{tab}</span>
                        {tab === "Weekly Pulse" && activePulseForm && !hasSubmittedPulse && (
                            <span className="relative z-10 ml-1.5 w-1.5 h-1.5 rounded-full bg-accent-red inline-block animate-pulse" />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                >
                    {/* Feed */}
                    {activeTab === 0 && (
                        <div className="space-y-6">
                            {announcements.length > 0 ? (
                                announcements.map((a, i) => <AnnouncementCard key={a.id} announcement={a} index={i} />)
                            ) : (
                                <div className="py-16 text-center text-text-secondary font-mono glass-panel rounded-3xl">
                                    No announcements yet.
                                </div>
                            )}
                        </div>
                    )}

                    {/* My Events */}
                    {activeTab === 1 && (
                        <div className="space-y-4">
                            {myRsvps.length > 0 ? (
                                myRsvps.map((rsvp: any) => (
                                    <div key={rsvp.id} className="glass-panel rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div>
                                            <h4 className="font-heading font-bold text-text-primary">{rsvp.events?.title}</h4>
                                            <p className="font-mono text-xs text-text-secondary mt-1">
                                                {rsvp.events?.date ? new Date(rsvp.events.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }) : ""}
                                                {rsvp.events?.location ? ` · ${rsvp.events.location}` : ""}
                                            </p>
                                        </div>
                                        <EventRSVP eventId={rsvp.event_id} initialStatus={rsvp.status} />
                                    </div>
                                ))
                            ) : (
                                <div className="py-16 text-center text-text-secondary font-mono glass-panel rounded-3xl">
                                    You haven&apos;t RSVP&apos;d to any events yet.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Documents */}
                    {activeTab === 2 && <DocumentRepository documents={documents} />}

                    {/* Directory */}
                    {activeTab === 3 && <MemberDirectory members={members} />}

                    {/* Weekly Pulse */}
                    {activeTab === 4 && (
                        <div className="glass-panel rounded-2xl md:rounded-3xl p-5 md:p-8">
                            {!activePulseForm ? (
                                <div className="py-16 text-center text-text-secondary font-mono">
                                    No active pulse form this week. Check back later.
                                </div>
                            ) : hasSubmittedPulse ? (
                                <div className="py-16 text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-accent-teal/10 border border-accent-teal/30 flex items-center justify-center mx-auto">
                                        <span className="text-2xl">✓</span>
                                    </div>
                                    <h3 className="font-heading text-xl font-bold text-text-primary">Pulse Submitted</h3>
                                    <p className="font-mono text-sm text-text-secondary">You&apos;ve already submitted for this week. See you next week!</p>
                                </div>
                            ) : (
                                <PulseFormWidget form={activePulseForm} />
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// Inline pulse form widget
const PulseFormWidget = ({ form }: { form: any }) => {
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const questions: any[] = form.questions || [];
    const progress = questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0;

    const handleSubmit = async () => {
        setLoading(true);
        const { submitPulseResponse } = await import("@/lib/server-actions");
        const fd = new FormData();
        fd.append("form_id", form.id);
        fd.append("answers", JSON.stringify(answers));
        fd.append("comment", comment);
        const result = await submitPulseResponse(fd);
        if (result.success) setSubmitted(true);
        setLoading(false);
    };

    if (submitted) return (
        <div className="py-16 text-center space-y-4">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-20 h-20 rounded-full border-2 border-accent-teal mx-auto flex items-center justify-center"
            >
                <span className="text-3xl text-accent-teal">✓</span>
            </motion.div>
            <h3 className="font-heading text-xl font-bold gold-text">Pulse Sent</h3>
            <p className="font-mono text-sm text-text-secondary">Your feedback reaches the board directly.</p>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h3 className="font-heading text-2xl font-bold text-text-primary mb-1">{form.week_label}</h3>
                <p className="font-mono text-xs text-text-secondary">Weekly Pulse · {questions.length} questions</p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-white/10 rounded-full">
                <motion.div
                    className="h-1 bg-gradient-to-r from-accent-gold to-accent-gold-light rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Questions */}
            <div className="space-y-8">
                {questions.map((q: any) => (
                    <div key={q.id}>
                        <p className="font-mono text-sm text-text-primary mb-4">{q.question}</p>

                        {q.type === "rating" && (
                            <div className="flex gap-3">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: n }))}
                                        className={`w-11 h-11 rounded-xl font-heading font-bold text-lg border transition-all duration-200 ${answers[q.id] === n
                                                ? "bg-accent-gold text-primary border-accent-gold scale-110"
                                                : "border-white/10 text-text-secondary hover:border-accent-gold/40"
                                            }`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        )}

                        {q.type === "pill-select" && q.options && (
                            <div className="flex flex-wrap gap-3">
                                {q.options.map((opt: string) => (
                                    <button
                                        key={opt}
                                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                        className={`font-mono text-sm border rounded-full px-5 py-2 transition-all duration-200 ${answers[q.id] === opt
                                                ? "bg-accent-gold text-primary border-accent-gold"
                                                : "border-white/10 text-text-secondary hover:border-accent-gold/40"
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {q.type === "text" && (
                            <textarea
                                value={answers[q.id] || ""}
                                onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-sm font-mono text-text-primary h-24 focus:outline-none focus:border-accent-gold transition-colors resize-none"
                                placeholder="Your response..."
                            />
                        )}
                    </div>
                ))}

                {/* Open comment */}
                <div>
                    <p className="font-mono text-sm text-text-primary mb-3">Any additional thoughts? <span className="text-text-secondary">(optional)</span></p>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-sm font-mono text-text-primary h-20 focus:outline-none focus:border-accent-gold transition-colors resize-none"
                        placeholder="Open feedback..."
                    />
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold rounded-full hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
                {loading ? "Submitting..." : "Submit Pulse"}
            </button>
        </div>
    );
};
