"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Hero } from "@/components/hero";
import { ProjectShuffler } from "@/components/project-shuffler";
import { LiveEventCalendar } from "@/components/live-event-calendar";
import { SponsorShowcase } from "@/components/sponsor-showcase";
import { LiveImpactDashboard } from "@/components/live-impact-dashboard";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
    const portalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Accessibility Check: Respect reduced motion preferences
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
            if (portalRef.current) {
                portalRef.current.style.clipPath = "none";
            }
            return;
        }

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#dark-portal-trigger",
                    start: "top bottom",
                    end: "bottom bottom",
                    scrub: 1,
                    pin: "#dark-portal-container",
                    pinSpacing: true,
                    // markers: true, // For debugging
                }
            });

            tl.fromTo(portalRef.current,
                { clipPath: "circle(0% at 50% 100%)" },
                { clipPath: "circle(150% at 50% 100%)", ease: "none" }
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <main className="relative min-h-screen">
            {/* The trigger element defines the scroll volume needed for the reveal */}
            <div id="dark-portal-trigger" className="absolute top-[80vh] w-full h-[150vh] pointer-events-none" />

            <Hero />

            <div id="dark-portal-container" className="relative w-full overflow-hidden">
                <section
                    id="dark-portal"
                    ref={portalRef}
                    className="relative w-full bg-primary text-text-primary will-change-[clip-path,transform]"
                    style={{ clipPath: "circle(0% at 50% 100%)" }}
                >
                    <ProjectShuffler />
                    <LiveEventCalendar />
                    <SponsorShowcase />
                    <LiveImpactDashboard />
                    <div className="h-32" /> {/* Bottom padding equivalent to original pb-32 */}
                </section>
            </div>
        </main>
    );
}
