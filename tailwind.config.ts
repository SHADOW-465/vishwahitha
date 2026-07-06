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
            },
            backgroundImage: {
                "gold-gradient": "linear-gradient(135deg, #C9A84C, #FFD97D)",
                "gold-gradient-text": "linear-gradient(90deg, #C9A84C, #FFD97D, #C9A84C)",
                "cranberry-gradient": "linear-gradient(135deg, #D41367, #F53B86)",
                "cranberry-gradient-text": "linear-gradient(90deg, #D41367, #F53B86, #D41367)",
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
