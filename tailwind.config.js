/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        secondary: {
          50:  "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        "ping-once": {
          "0%":   { transform: "scale(1)",   opacity: "0.8" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "ping-once-delay": {
          "0%, 20%": { transform: "scale(1)",   opacity: "0" },
          "40%":     { transform: "scale(1)",   opacity: "0.6" },
          "100%":    { transform: "scale(2.6)", opacity: "0" },
        },
      },
      animation: {
        "ping-once":       "ping-once 0.6s ease-out forwards",
        "ping-once-delay": "ping-once-delay 0.9s ease-out forwards",
      },
    },
  },
  plugins: [],
};
