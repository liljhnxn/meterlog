import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#0b0d0f",
          900: "#111418",
          850: "#16191f",
          800: "#1d222a",
          700: "#272e38",
          600: "#384150",
          500: "#4f5b6e",
          400: "#748296",
          300: "#9ba8ba",
          200: "#cbd5e1",
          100: "#e2e8f0",
          50: "#f1f5f9",
        },
        accent: {
          DEFAULT: "#10b981", // muted emerald green
          hover: "#059669",
          muted: "rgba(16, 185, 129, 0.12)",
          border: "rgba(16, 185, 129, 0.25)",
          bright: "#34d399",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

