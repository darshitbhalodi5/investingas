import type { Config } from "tailwindcss";

export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            screens: {
                xs: "375px",
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1280px",
                mid: "1345px",
                "2xl": "1536px",
            },
        },
    },
    plugins: [],
} satisfies Config;
