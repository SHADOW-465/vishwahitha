"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { MagneticButton } from "./ui/magnetic-button";
import { useTheme } from "@/components/theme-provider";

const LAST_SEEN_KEY = "vishwahitha_announcements_last_seen";

export const Navbar = () => {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.role === "admin";
    const { theme } = useTheme();
    const isLight = theme === "light";
    const navRef = useRef<HTMLElement>(null);

    const [badgeCount, setBadgeCount] = useState(0);
    useEffect(() => {
        const lastSeen = localStorage.getItem(LAST_SEEN_KEY);
        if (!lastSeen) { setBadgeCount(3); return; }
    }, [user]);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    // Close dropdown on outside click
    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [menuOpen]);

    const linkClass = `text-sm font-medium transition-colors duration-300 inline-block hover:-translate-y-[1px] ${isLight
        ? "text-text-primary-light hover:text-[#B8860B]"
        : "text-text-secondary hover:text-text-primary"
        }`;

    const pillBg = scrolled
        ? isLight
            ? "bg-white/80 backdrop-blur-2xl border border-black/10 shadow-xl"
            : "bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl"
        : "bg-transparent border-transparent";

    const pillRadius = menuOpen ? "rounded-3xl" : "rounded-[3rem]";

    return (
        <motion.header
            ref={navRef as React.Ref<HTMLElement>}
            className={`fixed top-4 md:top-6 left-1/2 z-50 transition-all duration-500 ${pillRadius} px-4 md:px-6 py-2.5 md:py-3 flex flex-col w-[calc(100vw-2rem)] md:w-max max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-2rem)]`}
            style={{ background: "transparent" }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            initial={{ y: -100, x: "-50%", opacity: 0 }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
        >
            {/* Pill background */}
            <motion.div
                className={`absolute inset-0 transition-all duration-500 ${pillRadius} ${pillBg}`}
                aria-hidden
            />

            {/* Top row: logo + desktop nav + auth + hamburger */}
            <div className="relative z-10 flex items-center justify-between gap-4 md:gap-8">
                {/* Logo */}
                <Link href="/" className="font-heading font-bold text-lg md:text-xl tracking-tighter gold-text shrink-0">
                    VISHWAHITA
                </Link>

                {/* Desktop nav links */}
                <nav className="hidden lg:flex items-center gap-3 lg:gap-5">
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

                {/* Auth + hamburger */}
                <div className="flex items-center gap-3 shrink-0">
                    <SignedOut>
                        <MagneticButton>
                            <Link
                                href="/sign-up"
                                className="bg-gradient-to-r from-accent-gold to-accent-gold-light text-primary px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-bold tracking-wide hover:scale-[1.03] transition-transform duration-300 inline-block"
                            >
                                Join Us
                            </Link>
                        </MagneticButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton
                            appearance={{
                                variables: { colorPrimary: '#C9A84C' },
                                elements: { userButtonAvatarBox: "w-8 h-8 md:w-9 md:h-9 border-2 border-accent-gold/30" }
                            }}
                        />
                    </SignedIn>
                    {/* Hamburger — mobile/tablet only */}
                    <button
                        className="lg:hidden p-1.5 rounded-xl text-text-secondary hover:text-text-primary transition-colors"
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-label="Toggle navigation menu"
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown nav */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.nav
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                        className="overflow-hidden lg:hidden relative z-10"
                    >
                        <div className="flex flex-col gap-0.5 pt-3 pb-2 border-t border-white/10 mt-2">
                            {[
                                { href: "/about", label: "About" },
                                { href: "/initiatives", label: "Initiatives" },
                                { href: "/gallery", label: "Gallery" },
                                { href: "/announcements", label: "Announcements" },
                            ].map(({ href, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setMenuOpen(false)}
                                    className={`${linkClass} py-2.5 px-2 rounded-xl flex items-center gap-2`}
                                >
                                    {label}
                                    {label === "Announcements" && badgeCount > 0 && (
                                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-accent-red text-white text-[9px] font-bold animate-pulse">
                                            {badgeCount}
                                        </span>
                                    )}
                                </Link>
                            ))}
                            <SignedIn>
                                <Link
                                    href="/hub"
                                    onClick={() => setMenuOpen(false)}
                                    className={`${linkClass} py-2.5 px-2 rounded-xl`}
                                >
                                    Hub
                                </Link>
                            </SignedIn>
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    onClick={() => setMenuOpen(false)}
                                    className="text-sm font-medium gold-text hover:opacity-80 transition-opacity py-2.5 px-2 rounded-xl"
                                >
                                    Admin
                                </Link>
                            )}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </motion.header>
    );
};
