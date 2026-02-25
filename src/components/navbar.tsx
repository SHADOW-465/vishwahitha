"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { MagneticButton } from "./ui/magnetic-button";
import { useTheme } from "@/components/theme-provider";

const LAST_SEEN_KEY = "vishwahitha_announcements_last_seen";

export const Navbar = () => {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);
    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.role === "admin";
    const { theme } = useTheme();
    const isLight = theme === "light";

    // Announcement badge — count from localStorage timestamp
    const [badgeCount, setBadgeCount] = useState(0);
    useEffect(() => {
        const lastSeen = localStorage.getItem(LAST_SEEN_KEY);
        if (!lastSeen) { setBadgeCount(3); return; } // default hint for new users
        // Real count fetched only when signed in — kept lightweight here
    }, [user]);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    const linkClass = `text-sm font-medium transition-colors duration-300 inline-block hover:-translate-y-[1px] ${
        isLight
            ? "text-text-primary-light hover:text-[#B8860B]"
            : "text-text-secondary hover:text-text-primary"
    }`;

    const pillBg = scrolled
        ? isLight
            ? "bg-white/80 backdrop-blur-2xl border border-black/10 shadow-xl"
            : "bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl"
        : "bg-transparent border-transparent";

    return (
        <motion.header
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-[3rem] px-6 py-3 flex items-center justify-between gap-8 min-w-[320px] sm:min-w-[560px]`}
            style={{ background: "transparent" }}
            animate={{ y: 0, opacity: 1 }}
            initial={{ y: -100, opacity: 0 }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
        >
            {/* Pill background as animated div */}
            <motion.div
                className={`absolute inset-0 rounded-[3rem] transition-all duration-500 ${pillBg}`}
                aria-hidden
            />

            {/* Logo */}
            <Link href="/" className="relative z-10 font-heading font-bold text-xl tracking-tighter gold-text">
                VISHWAHITA
            </Link>

            {/* Nav links */}
            <nav className="relative z-10 hidden md:flex items-center gap-5">
                <MagneticButton><Link href="/about" className={linkClass}>About</Link></MagneticButton>
                <MagneticButton><Link href="/initiatives" className={linkClass}>Initiatives</Link></MagneticButton>
                <MagneticButton><Link href="/gallery" className={linkClass}>Gallery</Link></MagneticButton>
                <MagneticButton>
                    <Link href="/announcements" className={`${linkClass} relative`}>
                        Announcements
                        {badgeCount > 0 && (
                            <span className="absolute -top-2 -right-3 w-4 h-4 rounded-full bg-accent-red text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                                {badgeCount}
                            </span>
                        )}
                    </Link>
                </MagneticButton>
                <SignedIn>
                    <MagneticButton><Link href="/hub" className={linkClass}>Hub</Link></MagneticButton>
                </SignedIn>
                {isAdmin && (
                    <MagneticButton>
                        <Link href="/admin" className="text-sm font-medium gold-text hover:opacity-80 transition-opacity inline-block hover:-translate-y-[1px]">
                            Admin
                        </Link>
                    </MagneticButton>
                )}
            </nav>

            {/* Auth */}
            <div className="relative z-10 flex items-center gap-3">
                <SignedOut>
                    <MagneticButton>
                        <Link
                            href="/sign-up"
                            className="bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary px-5 py-2 rounded-full text-sm font-bold tracking-wide hover:scale-[1.03] transition-transform duration-300 inline-block"
                        >
                            Join Us
                        </Link>
                    </MagneticButton>
                </SignedOut>
                <SignedIn>
                    <UserButton
                        appearance={{
                            variables: { colorPrimary: '#C9A84C' },
                            elements: { userButtonAvatarBox: "w-9 h-9 border-2 border-accent-gold/30" }
                        }}
                    />
                </SignedIn>
            </div>
        </motion.header>
    );
};
