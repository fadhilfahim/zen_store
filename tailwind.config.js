/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Semantic tokens. Actual values live in CSS variables (globals.css).
        bg: "rgb(var(--zen-bg) / <alpha-value>)",
        fg: "rgb(var(--zen-fg) / <alpha-value>)",
        muted: "rgb(var(--zen-muted) / <alpha-value>)",
        subtle: "rgb(var(--zen-subtle) / <alpha-value>)",
        border: "rgb(var(--zen-border) / <alpha-value>)",
        card: "rgb(var(--zen-card) / <alpha-value>)",
        ring: "rgb(var(--zen-ring) / <alpha-value>)",
        danger: "rgb(var(--zen-danger) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      borderRadius: {
        xl: "1rem"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(0,0,0,0.18)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-up": "fade-up 700ms cubic-bezier(0.21, 1, 0.21, 1) both"
      }
    }
  },
  plugins: []
};

