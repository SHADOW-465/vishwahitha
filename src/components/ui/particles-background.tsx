"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, Engine } from "@tsparticles/engine";

export const ParticlesBackground = () => {
    const [init, setInit] = useState(false);

    // Initialize the particles engine
    useEffect(() => {
        initParticlesEngine(async (engine: Engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = async (container?: Container): Promise<void> => {
        // Optional callback when particles are loaded
    };

    if (!init) {
        return null;
    }

    return (
        <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={{
                fullScreen: {
                    enable: false, // Prevents tsparticles from messing with layout z-indexes improperly
                    zIndex: -40
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onHover: {
                            enable: true,
                            mode: "grab", // Grab mode draws a line from cursor to nearby particles
                        },
                        resize: {
                            enable: true
                        }
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            links: {
                                opacity: 0.5,
                                color: "#FBD300", // Gold connection on hover
                            },
                        },
                    },
                },
                particles: {
                    color: {
                        value: ["#FAF8F5", "#D91B5C", "#FBD300"], // White, Cranberry, Gold
                    },
                    links: {
                        color: "#ffffff",
                        distance: 120,
                        enable: true,
                        opacity: 0.1,
                        width: 1,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 0.6,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            width: 800,
                            height: 800
                        },
                        value: 60, // Light density so it doesn't overwhelm the screen
                    },
                    opacity: {
                        value: { min: 0.1, max: 0.3 }, // Very subtle nodes
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 3 },
                    },
                },
                detectRetina: true,
            }}
            className="fixed inset-0 -z-40 pointer-events-auto"
        />
    );
};
