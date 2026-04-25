import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        soil: {
          50: "#fdf8f0",
          100: "#f9edd8",
          200: "#f0d4a8",
          300: "#e5b472",
          400: "#d8903f",
          500: "#c47322",
          600: "#a85c1a",
          700: "#884516",
          800: "#6e3717",
          900: "#5a2e16",
        },
        leaf: {
          50: "#f0faf0",
          100: "#d8f3d8",
          200: "#b0e5b0",
          300: "#7dd07d",
          400: "#4db84d",
          500: "#2d9e2d",
          600: "#1e7f1e",
          700: "#186518",
          800: "#165016",
          900: "#134213",
        },
        sky: {
          crop: "#e8f4f8",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 2s linear infinite",
        float: "float 6s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "slide-in": "slideIn 0.5s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;