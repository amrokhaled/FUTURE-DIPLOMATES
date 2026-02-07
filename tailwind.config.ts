import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                brand: {
                    DEFAULT: "#418fda",
                    50: "#e6f2fd",
                    100: "#c2e0fb",
                    200: "#9dcef9",
                    300: "#78bcf7",
                    400: "#5da5ee",
                    500: "#418fda",
                    600: "#3579c6",
                    700: "#2a63b2",
                    800: "#1f4d9e",
                    900: "#14378a",
                    950: "#0d245a",
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
