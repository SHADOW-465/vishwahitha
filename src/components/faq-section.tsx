"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

export const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const faqs: FAQItem[] = [
        {
            question: "Who can join?",
            answer: "Students and young professionals in and around Chennai who want to run service projects and grow as leaders. Age and membership norms follow Rotaract guidelines for District 3234."
        },
        {
            question: "How do I apply?",
            answer: "Use Become a member on this page to create an account, then the board will guide you through orientation and induction. You can also follow announcements for open intake windows."
        },
        {
            question: "When was the club chartered?",
            answer: "10 March 1999, sponsored by the Rotary Club of Madras Industrial City. We operate under Rotary International District 3234."
        },
        {
            question: "What does Vishwahita mean?",
            answer: "Universal friendship — the principle behind how we design projects and work across committees."
        },
        {
            question: "Where do I see events and updates?",
            answer: "Public notices live under Announcements and in the Club Bulletin on the homepage. Members get fuller ops access in the Hub after sign-in."
        }
    ];

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 px-6 w-full max-w-4xl mx-auto border-t border-white/5 bg-transparent">
            <div className="text-center mb-12 md:mb-16 space-y-3">
                <p className="font-mono text-[10px] text-accent-gold uppercase tracking-[0.18em] font-medium">
                    Before you join
                </p>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary text-balance">
                    Questions people ask before joining
                </h2>
                <p className="font-mono text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
                    Membership, charter, and where to find what&apos;s happening this week.
                </p>
            </div>

            {/* Accordion List */}
            <div className="space-y-4">
                {faqs.map((faq, index) => {
                    const isOpen = activeIndex === index;
                    return (
                        <div 
                            key={index}
                            className="glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors duration-300 bg-black/10"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left text-text-primary transition-colors duration-200 group"
                            >
                                <span className="font-heading font-semibold text-base sm:text-lg group-hover:text-accent-gold transition-colors duration-250 pr-4">
                                    {faq.question}
                                </span>
                                <motion.span
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                                    className="text-text-secondary group-hover:text-accent-gold transition-colors"
                                >
                                    <ChevronDown size={18} />
                                </motion.span>
                            </button>
                            
                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                                    >
                                        <div className="px-6 pb-6 pt-1 border-t border-white/5 font-mono text-xs sm:text-sm text-text-secondary leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
