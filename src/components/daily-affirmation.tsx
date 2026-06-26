"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, Compass } from "lucide-react";

interface AffirmationProps {
    initialQuote?: string;
    initialChallenge?: string;
}

export const DailyAffirmation = ({
    initialQuote = "Service to others is the rent you pay for your room here on earth.",
    initialChallenge = "Today's Challenge: Reach out to a senior citizen or elder today and spend 10 minutes listening to their stories.",
}: AffirmationProps) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [displayedText, setDisplayedText] = useState("");
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    // Typewriter effect for the quote
    useEffect(() => {
        setDisplayedText("");
        setIsTypingComplete(false);
        let index = 0;
        const speed = 40; // ms per char
        const text = initialQuote;
        
        const timer = setInterval(() => {
            if (index < text.length) {
                setDisplayedText((prev) => prev + text.charAt(index));
                index++;
            } else {
                clearInterval(timer);
                setIsTypingComplete(true);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [initialQuote]);

    return (
        <section className="py-24 px-6 w-full max-w-4xl mx-auto flex flex-col items-center">
            {/* Header */}
            <div className="text-center mb-10 space-y-3">
                <div className="inline-flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/20 rounded-full px-3 py-1">
                    <Sparkles size={12} className="text-accent-gold" />
                    <span className="font-mono text-[10px] text-accent-gold uppercase tracking-[0.15em] font-medium">Daily Ritual</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary">
                    The Daily <span className="font-drama italic font-light gold-text">Inspiration</span>
                </h2>
                <p className="font-mono text-xs text-text-secondary">
                    Click the card below to flip and reveal today's challenge.
                </p>
            </div>

            {/* Flip Card Container */}
            <div 
                className="relative w-full max-w-xl h-80 cursor-pointer perspective-1000"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <motion.div
                    className="w-full h-full relative preserve-3d"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                >
                    {/* Front Side: Affirmation Quote */}
                    <div className="absolute inset-0 backface-hidden glass-panel rounded-3xl p-8 flex flex-col justify-between overflow-hidden">
                        {/* Glowing morning sunlight gradient behind */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-accent-gold/20 to-accent-red/20 blur-[60px] pointer-events-none rounded-full" />
                        
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <span className="font-mono text-xs text-text-secondary uppercase tracking-widest">Affirmation</span>
                            <span className="font-mono text-[10px] text-accent-gold">27 Years of Legacy</span>
                        </div>

                        <div className="flex-1 flex items-center justify-center py-6">
                            <blockquote className="text-xl sm:text-2xl font-drama italic text-text-primary text-center leading-relaxed font-light">
                                "{displayedText}"
                                {!isTypingComplete && (
                                    <span className="inline-block w-2 h-5 ml-1 bg-accent-gold animate-pulse" />
                                )}
                            </blockquote>
                        </div>

                        <div className="flex items-center justify-between text-text-secondary font-mono text-[10px] border-t border-white/5 pt-4">
                            <span className="flex items-center gap-1.5">
                                <Compass size={12} className="animate-spin-slow" /> Tap to reveal challenge
                            </span>
                            <span>#service</span>
                        </div>
                    </div>

                    {/* Back Side: Daily Challenge */}
                    <div 
                        className="absolute inset-0 backface-hidden glass-panel rounded-3xl p-8 flex flex-col justify-between overflow-hidden bg-primary rotateY-180"
                        style={{ transform: "rotateY(180deg)" }}
                    >
                        {/* Cool evening neon bloom behind */}
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent-teal/20 to-accent-gold/15 blur-[60px] pointer-events-none rounded-full" />

                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <span className="font-mono text-xs text-accent-teal uppercase tracking-widest">Today's Challenge</span>
                            <span className="font-mono text-[10px] text-accent-teal">Daily Action</span>
                        </div>

                        <div className="flex-1 flex items-center justify-center py-6">
                            <p className="text-lg md:text-xl font-heading font-semibold text-text-primary text-center leading-relaxed">
                                {initialChallenge}
                            </p>
                        </div>

                        <div className="flex items-center justify-between text-text-secondary font-mono text-[10px] border-t border-white/5 pt-4">
                            <span className="flex items-center gap-1.5">
                                <RefreshCw size={12} /> Tap to read quote again
                            </span>
                            <span className="text-accent-teal">#action</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
