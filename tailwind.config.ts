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
                primary: "#0A0A14",
                "accent-cranberry": "#D91B5C",
                "accent-gold": "#C9A84C",
                surface: "rgba(255, 255, 255, 0.03)",
                "text-primary": "#FAF8F5",
                "text-secondary": "#A1A1AA",
            },
            fontFamily: {
                heading: ["var(--font-heading)"],
                drama: ["var(--font-drama)"],
                mono: ["var(--font-mono)"],
            },
            borderRadius: {
                '2xl': '2rem',
                '3xl': '3rem',
            },
        },
    },
    plugins: [],
} satisfies Config;
