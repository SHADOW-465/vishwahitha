"use client";

import { motion } from "framer-motion";

export const DynamicAuras = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-80">
            {/* Deep Red Aura */}
            <motion.div
                className="absolute top-[10%] left-[20%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full bg-accent-red/30 blur-[180px] mix-blend-screen"
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
                className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-accent-gold/25 blur-[150px] mix-blend-screen"
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
                className="absolute top-[40%] right-[40%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-accent-teal/20 blur-[120px] mix-blend-screen"
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
