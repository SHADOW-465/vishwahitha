"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, X, ZoomIn, Compass } from "lucide-react";

interface GalleryImage {
    id: string;
    url: string;
    caption: string;
    category: string;
}

const galleryData: GalleryImage[] = [
    {
        id: "1",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800",
        caption: "Abstract Gold Flow — Representing our dynamic fellowship energy.",
        category: "Exhibition"
    },
    {
        id: "2",
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
        caption: "Architectural Shadows — Defining our structural planning approach.",
        category: "Planning"
    },
    {
        id: "3",
        url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=800",
        caption: "Light Play — Exploring new opportunities for local youth development.",
        category: "Summit"
    },
    {
        id: "4",
        url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800",
        caption: "Golden Geometry — The precise execution behind Vaagai campaigns.",
        category: "Campaign"
    },
    {
        id: "5",
        url: "https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800",
        caption: "Luxury Interiors — Setting high standards for community meetings.",
        category: "Assembly"
    },
    {
        id: "6",
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800",
        caption: "Study Space — Inspiring intellectual growth and continuous reading.",
        category: "Culture"
    }
];

export const CinematicGallery = () => {
    const [selectedImg, setSelectedImg] = useState<GalleryImage | null>(null);

    return (
        <section className="py-24 px-6 w-full max-w-7xl mx-auto border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <div>
                    <span className="font-mono text-xs text-accent-gold uppercase tracking-[0.3em]">Visual Records</span>
                    <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-text-primary tracking-tight mt-2">
                        Cinematic <span className="font-drama italic font-light gold-text">Gallery</span>
                    </h2>
                </div>
                <p className="font-mono text-sm text-text-secondary max-w-md">
                    Click on any image to open the high-fidelity blurred background lightbox for detailed captions.
                </p>
            </div>

            {/* Pinterest Masonry Layout */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {galleryData.map((img) => (
                    <div
                        key={img.id}
                        onClick={() => setSelectedImg(img)}
                        className="break-inside-avoid relative overflow-hidden rounded-[2rem] glass-panel border border-white/5 cursor-pointer group"
                    >
                        <img
                            src={img.url}
                            alt={img.caption}
                            className="w-full h-auto object-cover grayscale opacity-45 group-hover:opacity-85 group-hover:scale-[1.02] group-hover:grayscale-0 transition-all duration-700"
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-accent-gold mb-1">
                                {img.category}
                            </span>
                            <p className="font-heading font-bold text-sm text-text-primary line-clamp-2">
                                {img.caption}
                            </p>
                            <div className="absolute top-6 right-6 p-2.5 bg-black/50 border border-white/10 rounded-full text-accent-gold">
                                <ZoomIn size={14} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Fullscreen Lightbox Modal */}
            <AnimatePresence>
                {selectedImg && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
                        onClick={() => setSelectedImg(null)}
                    >
                        <button
                            onClick={() => setSelectedImg(null)}
                            className="absolute top-6 right-6 p-3 bg-white/5 border border-white/10 hover:border-accent-gold/40 text-text-secondary hover:text-text-primary rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl border border-white/10 glass-panel"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImg.url}
                                alt={selectedImg.caption}
                                className="w-full h-auto max-h-[65vh] object-contain mx-auto"
                            />
                            
                            <div className="p-6 md:p-8 bg-black/60 border-t border-white/5 space-y-2">
                                <span className="font-mono text-[10px] uppercase text-accent-gold tracking-widest font-semibold">
                                    {selectedImg.category}
                                </span>
                                <h3 className="text-lg md:text-xl font-heading font-bold text-text-primary">
                                    {selectedImg.caption}
                                </h3>
                                <div className="flex items-center gap-1.5 font-mono text-[9px] text-text-secondary pt-2">
                                    <Compass size={10} className="animate-spin-slow" />
                                    <span>Rotaract Vishwahita Digital Archive</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
