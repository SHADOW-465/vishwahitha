"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

/**
 * Act V opener · answer the objections before the ask.
 *
 * Hairline rows, not stacked glass cards — an accordion already has enough
 * affordance without giving each question its own container.
 */
export const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

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
        <div id="faq" className="w-full max-w-3xl mx-auto px-6">
            <h2
                className="font-heading font-extrabold text-step-3 text-text-primary tracking-tight mb-act-beat"
                data-reveal
            >
                Questions people ask{" "}
                <span className="font-display-drama text-gold-ink">before joining</span>
            </h2>

            <div className="border-t border-white/10" data-reveal>
                {faqs.map((faq, index) => {
                    const isOpen = activeIndex === index;
                    return (
                        <div key={faq.question} className="border-b border-white/10">
                            <h3>
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-panel-${index}`}
                                    className="w-full py-6 flex items-start justify-between gap-6 text-left group"
                                >
                                    <span className="font-heading font-semibold text-step-1 text-text-primary group-hover:text-gold-ink transition-colors duration-300">
                                        {faq.question}
                                    </span>
                                    <motion.span
                                        animate={{ rotate: isOpen ? 45 : 0 }}
                                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                        className="shrink-0 mt-1 text-text-secondary group-hover:text-gold-ink transition-colors"
                                        aria-hidden
                                    >
                                        <Plus size={18} />
                                    </motion.span>
                                </button>
                            </h3>

                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        id={`faq-panel-${index}`}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <p className="pb-7 pr-10 text-step-0 text-text-secondary measure">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
