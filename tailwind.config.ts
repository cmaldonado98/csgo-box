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
        csgo: {
          blue: "#4b69ff",
          purple: "#8847ff",
          pink: "#d32ce6",
          red: "#eb4b4b",
          gold: "#ffd700",
          button: "#4CAF50", // Aproximación a verde CSGO
          buttonDark: "#3e8e41",
        }
      },
    },
  },
  plugins: [],
};
export default config;
