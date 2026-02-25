"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export const CMSDrawer = ({ open, onClose, title, children }: Props) => (
    <AnimatePresence>
        {open && (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                />
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#0D0C1A] border-l border-white/10 z-50 overflow-y-auto"
                >
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-heading text-2xl font-bold text-text-primary">{title}</h2>
                            <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                <X size={20} className="text-text-secondary" />
                            </button>
                        </div>
                        {children}
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
);
