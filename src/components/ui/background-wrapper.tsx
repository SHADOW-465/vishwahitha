"use client";

/**
 * Phase 0: quiet paper only.
 * Particles / DynamicAuras unmounted (components kept on disk for possible later use).
 */
export const BackgroundWrapper = () => {
    return (
        <div
            className="fixed inset-0 overflow-hidden -z-50 pointer-events-none bg-[var(--background)]"
            aria-hidden
        />
    );
};
