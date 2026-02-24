"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

export const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hero-text-inner", {
                y: "110%",
                duration: 1.2,
                stagger: 0.1,
                ease: "power4.out",
                delay: 0.5
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative w-full h-[100dvh] flex items-end justify-start overflow-hidden bg-[#FAF8F5]">
            {/* Background Layer with Video Loop Structure & Fallback Image */}
            <div className="absolute inset-0 z-0">
                {/* 
                  Expected structure for your high-quality slow-motion video.
                  Uncomment and provide the correct src when the asset is ready.
                  <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                      <source src="/videos/nova-rise-loop.mp4" type="video/mp4" />
                  </video>
                */}
                <Image
                    src="https://images.unsplash.com/photo-1593113565694-c6c703b44b82?q=80&w=2069&auto=format&fit=crop"
                    alt="Hero Background"
                    fill
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
                    className="object-cover absolute inset-0 -z-10 opacity-[0.15] object-center mix-blend-multiply grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/80 to-[#FAF8F5]/20 z-10" />
            </div>

            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pb-24 md:pb-32">
                <div className="max-w-3xl space-y-6">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-primary tracking-tighter leading-[0.9]">
                        <span className="block overflow-hidden pb-2 mb-[-8px]">
                            <span className="hero-text-inner block">A Bridge Between</span>
                        </span>
                        <span className="block overflow-hidden pb-2 mb-[-8px] flex flex-wrap items-center gap-4">
                            <span className="hero-text-inner block text-accent-gold font-drama italic font-light tracking-normal drop-shadow-glow-gold">Creation</span>
                            <span className="hero-text-inner block font-sans font-light">{"&"}</span>
                        </span>
                        <span className="block overflow-hidden pb-2 mb-[-8px]">
                            <span className="hero-text-inner block text-accent-cranberry">Impact.</span>
                        </span>
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-600 font-mono max-w-xl flex flex-col gap-1 mt-8">
                        <span className="block overflow-hidden pb-1">
                            <span className="hero-text-inner block">Empowering communities through</span>
                        </span>
                        <span className="block overflow-hidden pb-1">
                            <span className="hero-text-inner block">high-impact service. Led by</span>
                        </span>
                        <span className="block overflow-hidden pb-1">
                            <span className="hero-text-inner block text-primary font-medium">President Rtr. Shivanandhini.</span>
                        </span>
                    </p>
                </div>
            </div>
        </section>
    );
};
