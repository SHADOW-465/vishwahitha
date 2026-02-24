"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hero-text", {
                y: 100,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: "power4.out",
                delay: 0.5
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative w-full h-[100dvh] flex items-end justify-start overflow-hidden">
            {/* Background with placeholder gradient simulating image/video overlay */}
            <div className="absolute inset-0 z-0 bg-primary">
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593113565694-c6c703b44b82?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-40 z-0 mix-blend-luminosity grayscale" />
            </div>

            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pb-24 md:pb-32">
                <div className="max-w-3xl space-y-6">
                    <h1 className="hero-text text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-text-primary tracking-tighter leading-[0.9]">
                        A Bridge Between <br />
                        <span className="text-accent-gold font-drama italic font-light tracking-normal">Creation</span> {"&"} <br />
                        <span className="text-accent-cranberry">Impact.</span>
                    </h1>
                    <p className="hero-text text-lg md:text-2xl text-text-secondary font-mono max-w-xl">
                        Community Luxe. We are the Rotaract Club of Vishwahita, merging high-end execution with dedicated NGO roots.
                    </p>
                </div>
            </div>
        </section>
    );
};
