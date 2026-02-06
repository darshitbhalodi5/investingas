import type { Config } from "tailwindcss";

export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                secondary: "var(--secondary)",
                accent: "var(--accent)",
                card: "var(--card)",
                border: "var(--border)",
            },
            screens: {
                xs: "375px",
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px",
                mid: "1345px",
                "2xl": "1536px",
            },
            fontFamily: {
                sans: ["var(--font-space-grotesk)", "sans-serif"],
                serif: ["var(--font-biorhyme)", "serif"],
            },
        },
    },
    plugins: [],
} satisfies Config;
