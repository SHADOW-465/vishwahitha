"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

export const CinematicBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const scrollProgressRef = useRef(0);
    const { scrollYProgress } = useScroll();

    // Track scroll progress smoothly
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        scrollProgressRef.current = latest;
    });

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

        // Lerped progress for scroll inertia
        let currentProgress = 0;

        // Particle Class
        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;
            alpha: number;
            baseX: number;
            baseY: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 2 + 1;
                this.color = "#D4AF37";
                this.alpha = Math.random() * 0.4 + 0.1;
                this.baseX = this.x;
                this.baseY = this.y;
            }

            update(progress: number) {
                // Natural movement
                this.baseX += this.vx;
                this.baseY += this.vy;

                if (this.baseX < 0 || this.baseX > width) this.vx *= -1;
                if (this.baseY < 0 || this.baseY > height) this.vy *= -1;

                this.x = this.baseX;
                this.y = this.baseY;

                // Chapter specific behavior interpolations
                if (progress > 0.2 && progress <= 0.4) {
                    // Chapter 2: Constellation / leader web - converge to grid nodes
                    const nodeCount = 6;
                    const nodeX = (width / (nodeCount + 1)) * (Math.floor(this.x / (width / nodeCount)) + 1);
                    const nodeY = height * 0.5 + Math.sin(this.x * 0.01) * 100;
                    
                    const factor = (progress - 0.2) / 0.2; // 0 to 1
                    this.x = this.x + (nodeX - this.x) * factor * 0.35;
                    this.y = this.y + (nodeY - this.y) * factor * 0.35;
                    this.color = "#D41367"; // Cranberry
                } else if (progress > 0.4 && progress <= 0.6) {
                    // Chapter 3: Community - float like organic leaves
                    const factor = (progress - 0.4) / 0.2;
                    this.vx += Math.sin(this.y * 0.02) * 0.02;
                    this.color = "#00C9A7"; // Teal
                } else if (progress > 0.6 && progress <= 0.8) {
                    // Chapter 4: Impact - form grid structure
                    const factor = (progress - 0.6) / 0.2;
                    const gridCols = 15;
                    const index = Math.floor((this.x + this.y) % 15);
                    const targetX = (width / (gridCols + 1)) * (index + 1);
                    const targetY = height * 0.3 + (index * 25);
                    
                    this.x = this.x + (targetX - this.x) * factor * 0.4;
                    this.y = this.y + (targetY - this.y) * factor * 0.4;
                    this.color = "#D4AF37"; // Rotaract Gold
                } else if (progress > 0.8) {
                    // Chapter 5: Sunset / Join - drift outward
                    const factor = (progress - 0.8) / 0.2;
                    const centerX = width * 0.5;
                    const centerY = height * 0.5;
                    const dx = this.x - centerX;
                    const dy = this.y - centerY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    this.x += (dx / dist) * factor * 1.5;
                    this.y += (dy / dist) * factor * 1.5;
                    this.color = "#D41367"; // Cranberry
                } else {
                    this.color = "#D4AF37";
                }
            }

            draw(c: CanvasRenderingContext2D) {
                c.save();
                c.beginPath();
                c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                c.fillStyle = this.color;
                c.globalAlpha = this.alpha;
                c.shadowBlur = 6;
                c.shadowColor = this.color;
                c.fill();
                c.restore();
            }
        }

        const particles: Particle[] = Array.from({ length: 80 }, () => new Particle());

        // Gear values
        let gearRotation = 0;

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            // Smooth progress interpolation
            currentProgress += (scrollProgressRef.current - currentProgress) * 0.08;

            // ── Dynamic Background Color / Gradient Chapters ─────────────────
            let bgGlowX1 = width * 0.8;
            let bgGlowY1 = height * 0.8;
            let bgGlowColor1 = "rgba(212, 175, 55, 0.06)"; // Gold
            let bgGlowRadius1 = Math.min(width, height) * 0.6;

            let bgGlowX2 = width * 0.2;
            let bgGlowY2 = height * 0.2;
            let bgGlowColor2 = "rgba(212, 19, 103, 0.04)"; // Cranberry
            let bgGlowRadius2 = Math.min(width, height) * 0.4;

            if (currentProgress > 0.2 && currentProgress <= 0.4) {
                // Chapter 2: Deep Cranberry network
                const factor = (currentProgress - 0.2) / 0.2;
                bgGlowColor1 = `rgba(212, 19, 103, ${0.06 + factor * 0.04})`; // More Cranberry
                bgGlowColor2 = "rgba(212, 175, 55, 0.01)";
            } else if (currentProgress > 0.4 && currentProgress <= 0.6) {
                // Chapter 3: Teal community
                const factor = (currentProgress - 0.4) / 0.2;
                bgGlowColor1 = `rgba(0, 201, 167, ${0.05 * factor})`; // Teal
                bgGlowColor2 = `rgba(212, 19, 103, ${0.04 * (1 - factor)})`;
            } else if (currentProgress > 0.6 && currentProgress <= 0.8) {
                // Chapter 4: Gold statistics
                const factor = (currentProgress - 0.6) / 0.2;
                bgGlowColor1 = `rgba(212, 175, 55, ${0.08 * factor})`;
                bgGlowColor2 = "rgba(212, 19, 103, 0.02)";
            } else if (currentProgress > 0.8) {
                // Chapter 5: Sunset
                const factor = (currentProgress - 0.8) / 0.2;
                bgGlowColor1 = `rgba(212, 175, 55, ${0.08 + factor * 0.02})`;
                bgGlowColor2 = `rgba(212, 19, 103, ${0.06 * factor})`; // Cranberry
                bgGlowRadius1 = Math.min(width, height) * 0.8;
                bgGlowY1 = height;
            }

            // Draw Glow 1
            const gradient1 = ctx.createRadialGradient(bgGlowX1, bgGlowY1, 10, bgGlowX1, bgGlowY1, bgGlowRadius1);
            gradient1.addColorStop(0, bgGlowColor1);
            gradient1.addColorStop(1, "transparent");
            ctx.fillStyle = gradient1;
            ctx.fillRect(0, 0, width, height);

            // Draw Glow 2
            const gradient2 = ctx.createRadialGradient(bgGlowX2, bgGlowY2, 10, bgGlowX2, bgGlowY2, bgGlowRadius2);
            gradient2.addColorStop(0, bgGlowColor2);
            gradient2.addColorStop(1, "transparent");
            ctx.fillStyle = gradient2;
            ctx.fillRect(0, 0, width, height);

            // ── Draw Rotary Gear (Chapter 1 Only, fades out in Chapter 2) ───
            if (currentProgress < 0.3) {
                const gearAlpha = Math.max(0, 1 - (currentProgress / 0.25));
                const gearSize = Math.min(width, height) * 0.25;
                const gearX = width > 768 ? width * 0.72 : width * 0.5;
                const gearY = width > 768 ? height * 0.5 : height * 0.35;
                
                ctx.save();
                ctx.translate(gearX, gearY);
                gearRotation += 0.001;
                ctx.rotate(gearRotation);
                ctx.globalAlpha = gearAlpha * 0.12;
                ctx.strokeStyle = "#D4AF37";
                ctx.lineWidth = 3;

                // Inner circle
                ctx.beginPath();
                ctx.arc(0, 0, gearSize * 0.4, 0, Math.PI * 2);
                ctx.stroke();

                // Outer gear border
                ctx.beginPath();
                ctx.arc(0, 0, gearSize, 0, Math.PI * 2);
                ctx.stroke();

                // Gear teeth (24)
                const teeth = 24;
                ctx.fillStyle = "#D4AF37";
                for (let i = 0; i < teeth; i++) {
                    ctx.save();
                    ctx.rotate((Math.PI * 2 / teeth) * i);
                    ctx.fillRect(-6, -gearSize - 6, 12, 12);
                    ctx.restore();
                }

                // Spokes
                for (let i = 0; i < 6; i++) {
                    ctx.save();
                    ctx.rotate((Math.PI * 2 / 6) * i);
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(0, -gearSize);
                    ctx.stroke();
                    ctx.restore();
                }

                ctx.restore();
            }

            // ── Update & Draw Particles ──────────────────────────────────────
            particles.forEach((p) => {
                p.update(currentProgress);
                p.draw(ctx);
            });

            // Draw connecting lines in Chapter 2 (Constellation web)
            if (currentProgress > 0.15 && currentProgress < 0.45) {
                const lineAlpha = currentProgress <= 0.3 
                    ? (currentProgress - 0.15) / 0.15 
                    : (0.45 - currentProgress) / 0.15;
                
                ctx.strokeStyle = "#D41367";
                ctx.save();
                ctx.globalAlpha = Math.max(0, lineAlpha) * 0.12;
                
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 110) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
                ctx.restore();
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-screen h-screen -z-50 pointer-events-none bg-[#020617]"
        />
    );
};
