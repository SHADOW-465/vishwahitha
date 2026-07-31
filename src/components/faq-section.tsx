"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    /** Compact: no full-page section chrome — nest under Join */
    embedded?: boolean;
}

export const FAQSection = ({ embedded = false }: FAQSectionProps) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const faqs: FAQItem[] = [
        {
            question: "Who can join?",
            answer:
                "Students and young professionals in and around Chennai who want to run service projects and grow as leaders. Age and membership norms follow Rotaract guidelines for District 3234.",
        },
        {
            question: "How do I apply?",
            answer:
                "Use the membership application form on this page (name, email, phone, and why you want to join). The board reviews submissions and will contact you about orientation. Already a member? Sign in under Member.",
        },
        {
            question: "When was the club chartered?",
            answer:
                "10 March 1999, sponsored by the Rotary Club of Madras Industrial City. We operate under Rotary International District 3234, Group 01.",
        },
        {
            question: "What does Vishwahita mean?",
            answer:
                "Universal friendship — the principle behind how we design projects and work across committees.",
        },
        {
            question: "Where do I see events and updates?",
            answer:
                "Public notices live under Notices and in the Club Bulletin on the homepage. Full calendar: Events. After induction, sign in for RSVP and clubroom tools.",
        },
    ];

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const list = (
        <div className="space-y-3">
            {faqs.map((faq, index) => {
                const isOpen = activeIndex === index;
                return (
                    <div
                        key={index}
                        className="rounded-2xl overflow-hidden border border-white/8 bg-black/10"
                    >
                        <button
                            type="button"
                            onClick={() => toggleFAQ(index)}
                            className="w-full px-5 py-4 flex items-center justify-between text-left text-text-primary transition-colors duration-200 group"
                        >
                            <span className="font-heading font-semibold text-sm sm:text-base group-hover:text-accent-gold transition-colors pr-4">
                                {faq.question}
                            </span>
                            <motion.span
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                                className="text-text-secondary shrink-0"
                            >
                                <ChevronDown size={16} />
                            </motion.span>
                        </button>

                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                                >
                                    <div className="px-5 pb-5 pt-1 border-t border-white/5 font-mono text-xs sm:text-sm text-text-secondary leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );

    if (embedded) {
        return (
            <div className="mt-10 space-y-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                    Before you apply
                </p>
                {list}
            </div>
        );
    }

    return (
        <section id="faq" className="py-24 px-6 w-full max-w-4xl mx-auto border-t border-white/5">
            <div className="text-center mb-10 space-y-3">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary text-balance">
                    Questions before joining
                </h2>
            </div>
            {list}
        </section>
    );
};
