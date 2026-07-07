"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

export const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const faqs: FAQItem[] = [
        {
            question: "When was the Rotaract Club of Vishwahita chartered?",
            answer: "The club was chartered on March 10, 1999, under the sponsorship of the Rotary Club of Madras Industrial City."
        },
        {
            question: "Which Rotary District does the club belong to?",
            answer: "The Rotaract Club of Vishwahita operates under District 3234."
        },
        {
            question: "What does \"Vishwahita\" mean?",
            answer: "Vishwahita means \"universal friendship\" — the principle that shapes the club's project design and committee structure."
        },
        {
            question: "How many projects has the club completed?",
            answer: "The club has delivered 500+ initiatives and reached more than 2,000 individuals over 27 years."
        },
        {
            question: "How can I join the Rotaract Club of Vishwahita?",
            answer: "Reach out through the membership form on this page. Both students and young professionals in Chennai are eligible to apply."
        }
    ];

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 px-6 w-full max-w-4xl mx-auto border-t border-white/5 bg-transparent">
            {/* Header */}
            <div className="text-center mb-16 space-y-3">
                <div className="inline-flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/20 rounded-full px-3 py-1">
                    <HelpCircle size={12} className="text-accent-gold" />
                    <span className="font-mono text-[10px] text-accent-gold uppercase tracking-[0.15em] font-medium">FAQ</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary">
                    Frequently Asked <span className="font-drama italic font-light gold-text">Questions</span>
                </h2>
                <p className="font-mono text-xs text-text-secondary">
                    Clear answers on our history, structure, and admissions protocol.
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
