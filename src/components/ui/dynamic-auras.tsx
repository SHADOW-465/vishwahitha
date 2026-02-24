"use client";

import { motion } from "framer-motion";

export const DynamicAuras = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-50">
            {/* Cranberry Aura */}
            <motion.div
                className="absolute top-[10%] left-[20%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-accent-cranberry/20 blur-[150px] mix-blend-screen"
                animate={{
                    x: ["0%", "10%", "-10%", "0%"],
                    y: ["0%", "-10%", "10%", "0%"],
                    scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* Gold Aura */}
            <motion.div
                className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-accent-gold/15 blur-[120px] mix-blend-screen"
                animate={{
                    x: ["0%", "-15%", "5%", "0%"],
                    y: ["0%", "10%", "-15%", "0%"],
                    scale: [1, 1.2, 0.8, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* Secondary Deep Aura */}
            <motion.div
                className="absolute top-[40%] right-[30%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] rounded-full bg-[#3b0a24]/30 blur-[100px] mix-blend-screen"
                animate={{
                    x: ["0%", "5%", "-5%", "0%"],
                    y: ["0%", "-5%", "5%", "0%"],
                    scale: [0.9, 1.1, 1, 0.9],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
        </div>
    );
};
