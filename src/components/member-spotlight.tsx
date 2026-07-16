"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Award, Mail, Sparkles, User, Linkedin, Instagram } from "lucide-react";

interface BoardMember {
    id: string;
    name: string;
    role: string;
    email?: string;
    image_url?: string;
}

interface SpotlightCardProps {
    member: BoardMember;
}

const SpotlightCard = ({ member }: SpotlightCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [hovering, setHovering] = useState(false);

    // Mouse coordinates inside card
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // 3D Tilt values using springs
    const tiltX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 15 });
    const tiltY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 15 });

    // Spotlight glow coordinates
    const glowX = useMotionValue(0);
    const glowY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        
        // Normalize coordinates from -0.5 to 0.5
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        mouseX.set(x);
        mouseY.set(y);

        // Keep absolute coordinates for the radial gradient glow
        glowX.set(e.clientX - rect.left);
        glowY.set(e.clientY - rect.top);
    };

    const handleMouseEnter = () => {
        setHovering(true);
    };

    const handleMouseLeave = () => {
        setHovering(false);
        mouseX.set(0);
        mouseY.set(0);
    };

    // Fallback avatar image
    const avatarUrl = member.image_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400";

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative overflow-hidden w-full max-w-sm rounded-[2.5rem] glass-panel border border-white/5 p-6 min-h-[360px] flex flex-col justify-between cursor-pointer group perspective-1000"
        >
            {/* Spotlight Gradient Glow Layer */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: useTransform(
                        [glowX, glowY],
                        (coords) => `radial-gradient(circle 160px at ${coords[0]}px ${coords[1]}px, rgba(212,175,76,0.18), transparent)`
                    )
                }}
            />

            {/* 3D Content Container */}
            <motion.div
                style={{
                    rotateX: tiltX,
                    rotateY: tiltY,
                    transformStyle: "preserve-3d",
                }}
                className="relative z-10 w-full h-full flex flex-col justify-between flex-1"
            >
                {/* Upper Section */}
                <div style={{ transform: "translateZ(40px)" }} className="space-y-4">
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-white/10">
                        <img
                            src={avatarUrl}
                            alt={member.name}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
                    </div>

                    <div>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-accent-gold flex items-center gap-1">
                            <Award size={10} className="text-accent-cranberry" /> Board Executive
                        </span>
                        <h3 className="text-xl font-heading font-extrabold text-text-primary mt-1 truncate">
                            {member.name}
                        </h3>
                        <p className="font-mono text-xs text-text-secondary mt-0.5">
                            {member.role}
                        </p>
                    </div>
                </div>

                {/* Lower Section */}
                <div style={{ transform: "translateZ(20px)" }} className="border-t border-white/5 pt-4 mt-6 flex items-center justify-between text-text-secondary">
                    {member.email ? (
                        <div className="flex items-center gap-2 overflow-hidden max-w-[55%]">
                            <Mail size={11} className="text-accent-gold shrink-0" />
                            <span className="font-mono text-[9px] truncate">{member.email}</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <User size={11} className="text-accent-gold" />
                            <span className="font-mono text-[9px]">District 3234</span>
                        </div>
                    )}
                    
                    {/* Social actions */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        <a 
                            href={`mailto:${member.email || 'rcvishwahita@gmail.com'}`}
                            className="hover:text-accent-cranberry transition-colors duration-200"
                            title="Email"
                        >
                            <Mail size={13} />
                        </a>
                        <a 
                            href="https://linkedin.com" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="hover:text-accent-cranberry transition-colors duration-200"
                            title="LinkedIn"
                        >
                            <Linkedin size={13} />
                        </a>
                        <a 
                            href="https://instagram.com" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="hover:text-accent-cranberry transition-colors duration-200"
                            title="Instagram"
                        >
                            <Instagram size={13} />
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export const MemberSpotlight = ({ members }: { members: BoardMember[] }) => {
    // Fallback board members stub if DB is empty
    const displayMembers = members && members.length > 0 ? members.slice(0, 3) : [
        {
            id: "1",
            name: "Rtr. Harish Kumar",
            role: "Club President",
            email: "president@vishwahitha.org",
            image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400"
        },
        {
            id: "2",
            name: "Rtr. Sneha Iyer",
            role: "Club Secretary",
            email: "secretary@vishwahitha.org",
            image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400"
        },
        {
            id: "3",
            name: "Rtr. Rajesh Pillai",
            role: "Director of Initiatives",
            email: "initiatives@vishwahitha.org",
            image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400"
        }
    ];

    return (
        <section className="py-24 px-6 w-full max-w-7xl mx-auto border-t border-white/5">
            <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
                <div className="inline-flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/25 rounded-full px-3 py-1">
                    <Sparkles size={12} className="text-accent-gold animate-pulse" />
                    <span className="font-mono text-[10px] text-accent-gold uppercase tracking-[0.15em] font-medium">Spotlight</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-text-primary tracking-tight">
                    Executive <span className="font-drama italic font-light gold-text">Leaders</span>
                </h2>
                <p className="font-mono text-sm text-text-secondary">
                    Our weekly spotlight features members and board executives directing initiatives and driving impact in Chennai.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {displayMembers.map((member) => (
                    <SpotlightCard key={member.id} member={member} />
                ))}
            </div>
        </section>
    );
};
