import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Dark zone base
                primary: "#020617",
                // Light zone base
                "primary-light": "#FAF8F5",
                // Gold gradient endpoints
                "accent-gold": "#D4AF37",
                "accent-gold-light": "#F5E6C4",
                // Accent blue
                "accent-blue": "#3B82F6",
                // Energy / urgency
                "accent-red": "#E8394D",
                // Rotaract Cranberry
                "accent-cranberry": "#D41367",
                "accent-cranberry-light": "#F7E6EC",
                // Service / growth
                "accent-teal": "#00C9A7",
                // Text-safe accent inks (see globals.css — the surface golds
                // and cranberry fall under 4.5:1 at body size on midnight)
                "gold-ink": "var(--gold-ink)",
                "cranberry-ink": "var(--cranberry-ink)",
                // Text
                "text-primary": "#FAF8F5",
                "text-secondary": "#A1A1AA",
                "text-primary-light": "#0D0C14",
                "text-secondary-light": "#5A5A6A",
                // Glass
                surface: "rgba(255, 255, 255, 0.08)",
            },
            fontFamily: {
                heading: ["var(--font-heading)"],
                drama: ["var(--font-drama)"],
                mono: ["var(--font-mono)"],
                serifItalic: ["var(--font-serif-italic)"],
                signature: ["var(--font-signature)", "cursive"],
            },
            backgroundImage: {
                "gold-gradient": "linear-gradient(135deg, #C9A84C, #FFD97D)",
                "gold-gradient-text": "linear-gradient(90deg, #C9A84C, #FFD97D, #C9A84C)",
                "cranberry-gradient": "linear-gradient(135deg, #D41367, #F53B86)",
                "cranberry-gradient-text": "linear-gradient(90deg, #D41367, #F53B86, #D41367)",
            },
            fontSize: {
                // Fluid modular scale (1.25) from globals.css
                "step--1": ["var(--step--1)", { lineHeight: "1.6" }],
                "step-0": ["var(--step-0)", { lineHeight: "1.65" }],
                "step-1": ["var(--step-1)", { lineHeight: "1.4" }],
                "step-2": ["var(--step-2)", { lineHeight: "1.25" }],
                "step-3": ["var(--step-3)", { lineHeight: "1.12" }],
                "step-4": ["var(--step-4)", { lineHeight: "1.02" }],
                "step-5": ["var(--step-5)", { lineHeight: "0.94" }],
            },
            spacing: {
                "act-lead": "var(--act-lead)",
                "act-beat": "var(--act-beat)",
                "act-tight": "var(--act-tight)",
            },
            borderRadius: {
                '2xl': '1.5rem',
                '3xl': '2rem',
                '4xl': '3rem',
            },
        },
    },
    plugins: [],
} satisfies Config;
