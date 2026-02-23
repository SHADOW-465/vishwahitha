"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { MagneticButton } from "./ui/magnetic-button";

export const Navbar = () => {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    return (
        <motion.header
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-[3rem] px-6 py-3 flex items-center justify-between gap-8 min-w-[320px] sm:min-w-[480px] ${scrolled ? "bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl" : "bg-transparent border-transparent"
                }`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
        >
            <Link href="/" className="font-heading font-bold text-xl tracking-tighter text-text-primary">
                VISHWAHITA
            </Link>

            <nav className="flex items-center gap-6">
                <MagneticButton>
                    <Link href="/gallery" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors inline-block hover:-translate-y-[1px]">
                        Gallery
                    </Link>
                </MagneticButton>
                <MagneticButton>
                    <Link href="/hub" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors inline-block hover:-translate-y-[1px]">
                        Hub
                    </Link>
                </MagneticButton>
            </nav>

            <MagneticButton>
                <Link href="/hub" className="bg-text-primary text-primary px-5 py-2 rounded-full text-sm font-bold tracking-wide hover:scale-[1.03] transition-transform duration-300 inline-block">
                    Join Us
                </Link>
            </MagneticButton>
        </motion.header>
    );
};
