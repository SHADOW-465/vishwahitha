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
    const portalRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const ctx = gsap.context(() => {
            if (prefersReducedMotion) {
                gsap.fromTo(portalRef.current,
                    { opacity: 0 },
                    {
                        opacity: 1,
                        scrollTrigger: {
                            trigger: portalRef.current,
                            start: "top center",
                            end: "top top",
                            scrub: true
                        }
                    }
                );
            } else {
                gsap.fromTo(portalRef.current,
                    { clipPath: "circle(0% at 50% 100vh)" },
                    {
                        clipPath: "circle(150% at 50% 100%)",
                        ease: "none",
                        scrollTrigger: {
                            trigger: portalRef.current,
                            start: "top top",
                            end: "+=150%",
                            pin: true,
                            scrub: 1,
                            anticipatePin: 1
                        }
                    }
                );
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <main className="min-h-screen bg-[#FAF8F5]">
            <Hero />

            <section
                id="dark-portal"
                ref={portalRef}
                className="bg-primary text-text-primary will-change-transform pb-32 min-h-screen"
                style={{
                    clipPath: "circle(0% at 50% 100vh)",
                    WebkitClipPath: "circle(0% at 50% 100vh)",
                }}
            >
                <div className="pt-24 md:pt-32">
                    <ProjectShuffler />
                    <LiveEventCalendar />
                    <SponsorShowcase />
                    <LiveImpactDashboard />
                </div>
            </section>
        </main>
    );
}
