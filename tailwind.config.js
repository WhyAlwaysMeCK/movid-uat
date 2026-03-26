/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: "#f8f3ed",
          100: "#f3ece3",
          200: "#e5d6c2"
        },
        sage: {
          50: "#f3f7f2",
          100: "#dde7de",
          200: "#c5d5c7",
          300: "#9bb6a0",
          400: "#6f9277",
          500: "#4f6f57",
          600: "#38513f",
          700: "#24372b",
          800: "#17231c"
        },
        gold: {
          100: "#f8ebc6",
          200: "#efd18a",
          300: "#d4b46a",
          400: "#af8d41"
        },
        ink: {
          50: "#eef0ef",
          100: "#d8ddd9",
          700: "#47524d",
          800: "#28322c",
          900: "#17201a"
        }
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["Inter", "sans-serif"]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(30, 49, 38, 0.12)",
        card: "0 24px 65px rgba(27, 32, 29, 0.14)",
        insetGlow: "inset 0 1px 0 rgba(255, 255, 255, 0.55)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(212, 180, 106, 0.24), transparent 30%), radial-gradient(circle at bottom right, rgba(79, 111, 87, 0.18), transparent 28%), linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(243, 236, 227, 0.72))"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.22, 1, 0.36, 1)"
      },
      maxWidth: {
        "8xl": "90rem"
      }
    }
  },
  plugins: []
};
