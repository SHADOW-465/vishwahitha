import Image from "next/image";

/** Official club mark — gold horse/wings emblem (true alpha PNG) */
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
            className={`object-contain shrink-0 bg-transparent ${className}`}
            priority={priority}
            unoptimized
        />
    );
}

/**
 * Dim fixed watermark — gold mark only, no white plate.
 */
export function ClubLogoWatermark() {
    return (
        <div
            className="fixed inset-0 -z-40 pointer-events-none overflow-hidden select-none"
            aria-hidden
        >
            <div className="absolute inset-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/club-logo.png"
                    alt=""
                    className="w-[min(90vw,720px)] h-auto max-h-[75vh] object-contain opacity-[0.12] sm:opacity-[0.14]"
                    style={{
                        // On dark paper: lighten gold slightly so watermark reads soft, not milky
                        mixBlendMode: "screen",
                        filter: "brightness(1.1)",
                    }}
                    draggable={false}
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-primary/40 pointer-events-none" />
        </div>
    );
}
