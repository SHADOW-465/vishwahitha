"use client";

import { DynamicAuras } from "./dynamic-auras";
import { ParticlesBackground } from "./particles-background";

export const BackgroundWrapper = () => {
    return (
        <div className="fixed inset-0 overflow-hidden -z-50 bg-primary">
            {/* Base Background Color applied as solid to avoid transparent bleeding */}
            <div className="absolute inset-0 bg-primary" />

            {/* Layer 1: The glowing, moving auras */}
            <DynamicAuras />

            {/* Layer 2: The interactive particle network mesh */}
            <ParticlesBackground />
        </div>
    );
};
