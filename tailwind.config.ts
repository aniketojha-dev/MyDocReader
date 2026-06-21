import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#f5f0eb",
          surface: "#faf7f3",
          muted: "#f0ece6",
        },
        primary: {
          50: "#f2f4f6",
          100: "#e2e6ec",
          200: "#c8d0da",
          300: "#a5b1c1",
          400: "#7c8a9e",
          500: "#6a7a90",
          600: "#5a697d",
          700: "#4d5969",
          800: "#434c59",
          900: "#3b424d",
          950: "#272c34",
        },
        accent: {
          50: "#faf5f0",
          100: "#f3e8dc",
          200: "#e7ceb9",
          300: "#d8af90",
          400: "#c4956a",
          500: "#b88152",
          600: "#a96d43",
          700: "#8d5839",
          800: "#734933",
          900: "#5f3e2e",
          950: "#331f16",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-up": "fadeUp 0.6s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [typography],
};

export default config;
