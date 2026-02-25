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
                primary: "#08080F",
                // Light zone base
                "primary-light": "#FAFAF4",
                // Gold gradient endpoints
                "accent-gold": "#C9A84C",
                "accent-gold-light": "#FFD97D",
                // Energy / urgency
                "accent-red": "#E8394D",
                // Service / growth
                "accent-teal": "#00C9A7",
                // Text
                "text-primary": "#FAF8F5",
                "text-secondary": "#A1A1AA",
                "text-primary-light": "#0D0C14",
                "text-secondary-light": "#5A5A6A",
                // Glass
                surface: "rgba(255, 255, 255, 0.03)",
            },
            fontFamily: {
                heading: ["var(--font-heading)"],
                drama: ["var(--font-drama)"],
                mono: ["var(--font-mono)"],
            },
            backgroundImage: {
                "gold-gradient": "linear-gradient(135deg, #C9A84C, #FFD97D)",
                "gold-gradient-text": "linear-gradient(90deg, #C9A84C, #FFD97D, #C9A84C)",
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
