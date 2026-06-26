"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { MagneticButton } from "./ui/magnetic-button";

interface HeroProps {
    headlineLine1?: string;
    headlineLine2?: string;
    subtext?: string;
}

export const Hero = ({
    headlineLine1 = "27 Years of Youth-Led Service meets",
    headlineLine2 = "Impact.",
    subtext = "Welcome to the Digital Home of Rotaract Vishwahita. Fostering leaders, building lifelong fellowship, and driving sustainable service in Chennai.",
}: HeroProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isOver: false });

    // Canvas WebGL-like Particle & Logo scene
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        // Particle class
        class Particle {
            x: number;
            y: number;
            baseX: number;
            baseY: number;
            vx: number;
            vy: number;
            size: number;
            density: number;
            alpha: number;
            color: string;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.baseX = this.x;
                this.baseY = this.y;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.size = Math.random() * 2 + 1;
                this.density = Math.random() * 30 + 10;
                this.alpha = Math.random() * 0.5 + 0.2;
                this.color = Math.random() > 0.5 ? "#C9A84C" : "#FAF8F5";
            }

            update(mouseX: number, mouseY: number, mouseOver: boolean) {
                // Natural drift
                this.baseX += this.vx;
                this.baseY += this.vy;

                // Bounce off boundaries
                if (this.baseX < 0 || this.baseX > width) this.vx *= -1;
                if (this.baseY < 0 || this.baseY > height) this.vy *= -1;

                this.x = this.baseX;
                this.y = this.baseY;

                // Mouse interaction / ripple
                if (mouseOver) {
                    const dx = mouseX - this.x;
                    const dy = mouseY - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const forceRadius = 180;

                    if (distance < forceRadius) {
                        const force = (forceRadius - distance) / forceRadius;
                        const directionX = dx / distance;
                        const directionY = dy / distance;
                        
                        // Push away from cursor
                        this.x -= directionX * force * 45;
                        this.y -= directionY * force * 45;
                    }
                }
            }

            draw(c: CanvasRenderingContext2D) {
                c.save();
                c.beginPath();
                c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                c.fillStyle = this.color;
                c.globalAlpha = this.alpha;
                c.shadowBlur = 8;
                c.shadowColor = "#C9A84C";
                c.fill();
                c.restore();
            }
        }

        const particles: Particle[] = Array.from({ length: 80 }, () => new Particle());

        // Rotaract Logo parameters
        let rotationAngle = 0;
        const logoX = width * 0.75;
        const logoY = height * 0.5;

        const drawRotaractLogo = (c: CanvasRenderingContext2D, cx: number, cy: number, radius: number) => {
            c.save();
            c.translate(cx, cy);
            c.rotate(rotationAngle);

            // Draw gear outer ring
            c.strokeStyle = "#C9A84C";
            c.lineWidth = 4;
            c.globalAlpha = 0.15;
            c.beginPath();
            c.arc(0, 0, radius, 0, Math.PI * 2);
            c.stroke();

            // Draw gear teeth (24 teeth)
            const teethCount = 24;
            c.fillStyle = "#C9A84C";
            for (let i = 0; i < teethCount; i++) {
                c.save();
                c.rotate((Math.PI * 2 / teethCount) * i);
                c.fillRect(-6, -radius - 8, 12, 12);
                c.restore();
            }

            // Draw inner hub & spokes
            c.beginPath();
            c.arc(0, 0, radius * 0.4, 0, Math.PI * 2);
            c.stroke();

            // 6 Spokes
            const spokesCount = 6;
            for (let i = 0; i < spokesCount; i++) {
                c.save();
                c.rotate((Math.PI * 2 / spokesCount) * i);
                c.beginPath();
                c.moveTo(0, 0);
                c.lineTo(0, -radius);
                c.lineWidth = 2;
                c.stroke();
                c.restore();
            }

            // Central circle
            c.beginPath();
            c.arc(0, 0, 10, 0, Math.PI * 2);
            c.fillStyle = "#C9A84C";
            c.fill();

            c.restore();
        };

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Smooth mouse coords
            mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
            mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;

            // Draw rotating logo in the background
            rotationAngle += 0.0015;
            const logoSize = Math.min(width, height) * 0.28;
            // Place logo at the right-half side of the screen
            const currentLogoX = width > 768 ? width * 0.72 : width * 0.5;
            const currentLogoY = width > 768 ? height * 0.5 : height * 0.35;
            drawRotaractLogo(ctx, currentLogoX, currentLogoY, logoSize);

            // Update & Draw particles
            particles.forEach((p) => {
                p.update(mouseRef.current.x, mouseRef.current.y, mouseRef.current.isOver);
                p.draw(ctx);
            });

            // Draw lines between close particles
            ctx.strokeStyle = "#C9A84C";
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 140) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.globalAlpha = (140 - dist) / 140 * 0.12;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.targetX = e.clientX;
            mouseRef.current.targetY = e.clientY;
            mouseRef.current.isOver = true;
        };

        const handleMouseLeave = () => {
            mouseRef.current.isOver = false;
        };

        window.addEventListener("mousemove", handleMouseMove);
        document.body.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    // GSAP Stagger Animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".hero-reveal", {
                y: 50,
                opacity: 0,
                duration: 1.2,
                stagger: 0.12,
                ease: "power3.out",
                delay: 0.2,
            });

            gsap.from(".hero-badge", {
                scale: 0.8,
                opacity: 0,
                duration: 0.8,
                ease: "back.out(1.6)",
                delay: 0.1,
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-[100vh] flex items-end justify-start overflow-hidden bg-primary"
        >
            {/* Interactive Canvas Background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0 pointer-events-none"
            />

            {/* Gradient Overlay for Cinematic Depth */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary via-primary/75 to-transparent pointer-events-none" />
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary via-primary/30 to-transparent pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pt-32 pb-20 md:pb-28">
                <div className="max-w-4xl space-y-6">
                    {/* Badge */}
                    <div className="hero-badge inline-flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/25 rounded-full px-4 py-2 mb-2">
                        <Sparkles size={12} className="text-accent-gold animate-pulse" />
                        <span className="font-mono text-[10px] md:text-xs text-accent-gold uppercase tracking-[0.2em] font-medium">
                            Rotaract Club of Vishwahita
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="space-y-3">
                        <h1 className="hero-reveal font-heading font-extrabold text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] text-text-primary tracking-tighter leading-[0.95] text-balance">
                            {headlineLine1}
                        </h1>
                        <h1 className="hero-reveal font-drama italic font-light text-[3.5rem] sm:text-[5rem] md:text-[7.5rem] lg:text-[9rem] leading-[0.8] gold-text tracking-tight pb-2">
                            {headlineLine2}
                        </h1>
                    </div>

                    {/* Subtext */}
                    <p className="hero-reveal text-base md:text-lg text-text-secondary font-mono max-w-xl leading-relaxed pt-2">
                        {subtext}
                    </p>

                    {/* Dynamic CTAs */}
                    <div className="hero-reveal flex flex-wrap items-center gap-4 pt-6">
                        <MagneticButton>
                            <Link
                                href="/sign-up"
                                className="group relative overflow-hidden inline-flex items-center gap-2 bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary font-bold text-sm px-8 py-4 rounded-full transition-transform duration-300"
                            >
                                <span className="relative z-10">Become a Member</span>
                                <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </MagneticButton>
                        
                        <MagneticButton>
                            <a
                                href="#legacy"
                                className="inline-flex items-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 text-text-primary font-medium text-sm px-8 py-4 rounded-full transition-colors"
                            >
                                Explore Legacy
                            </a>
                        </MagneticButton>
                    </div>
                </div>
            </div>

            {/* Bottom scroll animation */}
            <div className="hero-reveal absolute bottom-10 right-10 z-20 hidden md:flex flex-col items-center gap-3 opacity-30">
                <span className="font-mono text-[9px] text-text-secondary uppercase tracking-[0.3em]">Scroll</span>
                <div className="w-px h-16 bg-gradient-to-b from-accent-gold to-transparent" />
            </div>
        </section>
    );
};
