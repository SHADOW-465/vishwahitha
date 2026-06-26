"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Check, Users, Handshake, Landmark } from "lucide-react";
import { MagneticButton } from "./ui/magnetic-button";

export const MembershipTiers = () => {
    const cards = [
        {
            title: "Become a Member",
            icon: <Users className="text-accent-blue" size={20} />,
            desc: "Join our active core fellowship in Chennai. Pitch ideas, lead volunteer campaigns, and build lifelong bonds.",
            actionText: "Apply to Join",
            href: "/sign-up",
            accent: "blue",
            features: [
                "Weekly general body assemblies",
                "Direct leadership & project roles",
                "Access to district-wide training summits",
                "Lifelong global Rotary network"
            ]
        },
        {
            title: "Partner With Us",
            icon: <Handshake className="text-accent-gold" size={20} />,
            desc: "For corporate CSR divisions, public bodies, and community trust groups seeking structured co-execution of campaigns.",
            actionText: "Initiate Partnership",
            href: "/sign-up", // links to signUp or contact flows
            accent: "gold",
            featured: true,
            features: [
                "Corporate Social Responsibility alignment",
                "Joint volunteer mobilization projects",
                "End-to-end impact documentation",
                "Brand visibility across district press"
            ]
        },
        {
            title: "Sponsor a Project",
            icon: <Landmark className="text-accent-teal" size={20} />,
            desc: "Directly fund or sponsor resources for our signature initiatives like Vaagai elder companionship or clothing drives.",
            actionText: "Support Campaign",
            href: "/sign-up",
            accent: "teal",
            features: [
                "100% direct-to-cause resource path",
                "Dedicated project-specific audit reports",
                "Custom co-branding on event collaterals",
                "Press release coverage of campaigns"
            ]
        }
    ];

    return (
        <section className="py-24 px-6 w-full max-w-7xl mx-auto border-t border-white/5 bg-transparent">
            <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/25 rounded-full px-3 py-1">
                    <Sparkles size={12} className="text-accent-gold animate-pulse" />
                    <span className="font-mono text-[10px] text-accent-gold uppercase tracking-[0.15em] font-medium">Get Involved</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-text-primary tracking-tight">
                    Join the <span className="font-drama italic font-light gold-text">Action</span>
                </h2>
                <p className="font-mono text-sm text-text-secondary">
                    Select your path to collaborate. We welcome active volunteer leaders, institutional partners, and sponsors.
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                {cards.map((card, index) => {
                    const borderClass = card.featured 
                        ? "border-accent-gold/40 shadow-2xl bg-white/2" 
                        : "border-white/5 bg-transparent hover:border-white/10";
                    const btnClass = card.featured
                        ? "bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary"
                        : "border border-white/10 hover:bg-white/5 text-text-primary";

                    return (
                        <div
                            key={index}
                            className={`relative overflow-hidden rounded-[2.5rem] glass-panel border p-8 flex flex-col justify-between h-full transition-all duration-500 hover:-translate-y-1 ${borderClass}`}
                        >
                            {/* Glow spot */}
                            {card.featured && (
                                <div className="absolute -top-16 -right-16 w-36 h-36 bg-accent-gold/10 blur-2xl rounded-full" />
                            )}

                            <div>
                                <div className="flex items-center justify-between">
                                    <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
                                        {card.icon}
                                    </div>
                                    {card.featured && (
                                        <span className="font-mono text-[9px] uppercase tracking-wider bg-accent-gold/15 text-accent-gold px-3 py-1 rounded-full border border-accent-gold/25">
                                            Featured Pathway
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-2xl font-heading font-extrabold text-text-primary mt-6">
                                    {card.title}
                                </h3>
                                <p className="font-mono text-xs text-text-secondary mt-3 leading-relaxed">
                                    {card.desc}
                                </p>

                                {/* Features List */}
                                <ul className="mt-8 space-y-3">
                                    {card.features.map((feat, idx) => (
                                        <li key={idx} className="flex items-start gap-2.5 text-xs font-mono text-text-secondary">
                                            <Check size={14} className="text-accent-gold shrink-0 mt-0.5" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-10">
                                <MagneticButton>
                                    <Link
                                        href={card.href}
                                        className={`w-full group flex items-center justify-center gap-2 font-mono text-xs rounded-full py-4 px-6 transition-all duration-300 font-bold ${btnClass}`}
                                    >
                                        {card.actionText}
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </MagneticButton>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
