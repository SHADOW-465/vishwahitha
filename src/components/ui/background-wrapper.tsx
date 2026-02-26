"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { ParticlesBackground } from "./particles-background";
import { DynamicAuras } from "./dynamic-auras";

export const BackgroundWrapper = () => {
    const { theme } = useTheme();
    const isLight = theme === "light";

    return (
        <div
            className="fixed inset-0 overflow-hidden -z-50 transition-colors duration-700 bg-[var(--background)]"
        >
            {/* Dark theme: cinematic auras */}
            <AnimatePresence>
                {!isLight && (
                    <motion.div
                        key="dark-auras"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 pointer-events-none"
                    >
                        <DynamicAuras />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Light theme: warm gold + teal auras on cream */}
            <AnimatePresence>
                {isLight && (
                    <motion.div
                        key="light-auras"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 pointer-events-none"
                    >
                        {/* Warm gold bloom */}
                        <motion.div
                            className="absolute top-[5%] left-[15%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full bg-accent-gold/20 blur-[180px]"
                            animate={{
                                x: ["0%", "8%", "-8%", "0%"],
                                y: ["0%", "-8%", "8%", "0%"],
                                scale: [1, 1.05, 0.95, 1],
                            }}
                            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                        />
                        {/* Teal accent */}
                        <motion.div
                            className="absolute bottom-[15%] right-[8%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full bg-accent-teal/15 blur-[120px]"
                            animate={{
                                x: ["0%", "-12%", "4%", "0%"],
                                y: ["0%", "8%", "-12%", "0%"],
                                scale: [1, 1.15, 0.85, 1],
                            }}
                            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Particle network — only on dark to keep light clean */}
            {!isLight && <ParticlesBackground />}
        </div>
    );
};
