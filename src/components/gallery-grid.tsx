"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface GalleryItem {
    id: string;
    url: string;
    title?: string;
    type: string;
    created_at: string;
    initiatives?: { title: string } | null;
}

interface Props {
    items: GalleryItem[];
    categories: string[];
}

export const GalleryGrid = ({ items, categories }: Props) => {
    const [filter, setFilter] = useState("All");
    const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

    const filtered =
        filter === "All" ? items : items.filter((i) => i.initiatives?.title === filter);

    return (
        <>
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-3 mb-10">
                {["All", ...categories].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`font-mono text-xs uppercase tracking-widest px-5 py-2 rounded-full border transition-all duration-200 ${
                            filter === cat
                                ? "border-accent-gold text-accent-gold bg-accent-gold/10"
                                : "border-white/10 text-text-secondary hover:border-white/30"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Masonry grid */}
            {filtered.length > 0 ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                    <AnimatePresence>
                        {filtered.map((item) => (
                            <motion.div
                                key={item.id}
                                layoutId={`gallery-item-${item.id}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => setLightbox(item)}
                                className="w-full break-inside-avoid relative group rounded-2xl overflow-hidden mb-6 cursor-zoom-in border border-white/5 hover:border-accent-gold/20 transition-colors"
                            >
                                {item.type === "video" ? (
                                    <video
                                        src={item.url}
                                        className="w-full rounded-2xl"
                                        muted
                                        playsInline
                                    />
                                ) : (
                                    <img
                                        src={item.url}
                                        alt={item.title || "Club photo"}
                                        className="w-full rounded-2xl group-hover:scale-[1.03] transition-transform duration-500"
                                    />
                                )}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {item.title && (
                                        <p className="font-heading font-medium text-white text-sm">
                                            {item.title}
                                        </p>
                                    )}
                                    {item.initiatives?.title && (
                                        <p className="font-mono text-[10px] text-accent-gold uppercase tracking-widest mt-0.5">
                                            {item.initiatives.title}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="py-24 text-center text-text-secondary font-mono text-sm glass-panel rounded-[2rem] border border-white/5">
                    No photos in this category yet.
                </div>
            )}

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                        onClick={() => setLightbox(null)}
                    >
                        <button
                            onClick={() => setLightbox(null)}
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                        >
                            <X size={20} />
                        </button>

                        <motion.div
                            layoutId={`gallery-item-${lightbox.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden"
                        >
                            {lightbox.type === "video" ? (
                                <video
                                    src={lightbox.url}
                                    controls
                                    autoPlay
                                    className="max-h-[85vh] rounded-2xl"
                                />
                            ) : (
                                <img
                                    src={lightbox.url}
                                    alt={lightbox.title || "Club photo"}
                                    className="max-h-[85vh] w-auto object-contain rounded-2xl"
                                />
                            )}
                            {lightbox.title && (
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                    <p className="font-heading font-bold text-white text-lg">
                                        {lightbox.title}
                                    </p>
                                    {lightbox.initiatives?.title && (
                                        <p className="font-mono text-xs text-accent-gold uppercase tracking-widest mt-1">
                                            {lightbox.initiatives.title}
                                        </p>
                                    )}
                                    <p className="font-mono text-[10px] text-white/50 mt-1">
                                        {new Date(lightbox.created_at).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
