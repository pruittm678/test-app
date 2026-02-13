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
        velvet: {
          900: "#1a0202",
          800: "#2d0505",
          700: "#3a0303",
          DEFAULT: "#4A0404",
          500: "#6b1010",
        },
        gold: {
          100: "#faf0d4",
          200: "#f0dca0",
          300: "#e6c86c",
          DEFAULT: "#D4AF37",
          500: "#b8922a",
          600: "#9a7a22",
          700: "#7c621b",
          800: "#5e4a14",
        },
        brass: {
          DEFAULT: "#C5A55A",
          dark: "#8B7332",
        },
        tuxedo: {
          DEFAULT: "#0a0a0a",
          800: "#141414",
          700: "#1e1e1e",
        },
        silver: {
          DEFAULT: "#C0C0C0",
          dark: "#8a8a8a",
        },
        sepia: {
          DEFAULT: "#C4A77D",
          dark: "#8B7355",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        serif: ["var(--font-serif)"],
      },
      animation: {
        "shimmer": "shimmer 3s ease-in-out infinite",
        "flicker": "flicker 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "sunburst-spin": "sunburst-spin 20s linear infinite",
        "marquee-glow": "marquee-glow 2s ease-in-out infinite alternate",
        "slide-up": "slide-up 0.6s ease-out",
        "fade-in": "fade-in 0.8s ease-out",
        "scale-in": "scale-in 0.5s ease-out",
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
          "75%": { opacity: "0.95" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "sunburst-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "marquee-glow": {
          "0%": { boxShadow: "0 0 10px rgba(212,175,55,0.3), inset 0 0 10px rgba(212,175,55,0.1)" },
          "100%": { boxShadow: "0 0 20px rgba(212,175,55,0.5), inset 0 0 20px rgba(212,175,55,0.2)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
