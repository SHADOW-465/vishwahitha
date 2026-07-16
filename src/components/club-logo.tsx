import Image from "next/image";

/** Official club mark — gold horse/wings emblem */
export function ClubLogoMark({
    size = 36,
    className = "",
    priority = false,
}: {
    size?: number;
    className?: string;
    priority?: boolean;
}) {
    return (
        <Image
            src="/club-logo.png"
            alt="Rotaract Club of Vishwahita"
            width={size}
            height={size}
            className={`object-contain shrink-0 ${className}`}
            priority={priority}
        />
    );
}

/**
 * Dim fixed watermark — brand presence without fighting text.
 * Uses CSS mask-friendly opacity; pointer-events none; below content.
 */
export function ClubLogoWatermark() {
    return (
        <div
            className="fixed inset-0 -z-40 pointer-events-none overflow-hidden select-none"
            aria-hidden
        >
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Large centered mark — very low opacity on dark paper */}
                <div
                    className="relative w-[min(92vw,720px)] aspect-square opacity-[0.045] sm:opacity-[0.055]"
                    style={{
                        backgroundImage: "url(/club-logo.png)",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                        filter: "grayscale(0.15)",
                    }}
                />
            </div>
            {/* Soft vignette so edges stay clean behind footer/nav */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-transparent to-primary/90" />
        </div>
    );
}
