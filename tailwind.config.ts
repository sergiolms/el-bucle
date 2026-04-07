import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Colores noir cyberpunk - atmósfera El Bucle
        retro: {
          pink: "#ff1493",      // Deep pink - más sutil
          purple: "#8b4789",    // Purple más apagado
          cyan: "#20b2aa",      // Light sea green - menos saturado
          yellow: "#daa520",    // Goldenrod - menos brillante
          orange: "#cd5c5c",    // Indian red - más oscuro
          magenta: "#ba55d3",   // Medium orchid
          blue: "#4682b4",      // Steel blue
          green: "#3cb371",     // Medium sea green
          darkPurple: "#1a0033",
          darkBlue: "#0a0a0f",  // Más oscuro para noir
          darkBlueLighter: "#12121f",
        },
        neon: {
          pink: "#ff00ff",
          cyan: "#00ffff",
          yellow: "#ffff00",
          green: "#00ff00",
          purple: "#8000ff",
          orange: "#ff8000",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        glow: {
          "0%, 100%": {
            textShadow: "0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor",
          },
          "50%": {
            textShadow: "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor",
          },
        },
        "neon-pulse": {
          "0%, 100%": {
            opacity: "1",
            filter: "drop-shadow(0 0 1px currentColor) drop-shadow(0 0 4px currentColor)",
          },
          "50%": {
            opacity: "0.9",
            filter: "drop-shadow(0 0 2px currentColor) drop-shadow(0 0 8px currentColor)",
          },
        },
        "grid-scan": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 50px" },
        },
        "flicker": {
          "0%, 100%": { opacity: "1" },
          "41%": { opacity: "1" },
          "42%": { opacity: "0.8" },
          "43%": { opacity: "1" },
          "45%": { opacity: "0.9" },
          "46%": { opacity: "1" },
        },
        "slide-in-bottom": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "retro-zoom": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
        "grid-scan": "grid-scan 3s linear infinite",
        flicker: "flicker 3s linear infinite",
        "slide-in-bottom": "slide-in-bottom 0.5s ease-out",
        "retro-zoom": "retro-zoom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      fontFamily: {
        mono: ["Share Tech Mono", "JetBrains Mono", "Fira Code", "Consolas", "Monaco", "monospace"],
        display: ["Press Start 2P", "monospace"],
        retro: ["VT323", "monospace"],
      },
      backgroundImage: {
        "retro-grid": "linear-gradient(rgba(255, 0, 128, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 128, 0.1) 1px, transparent 1px)",
        "retro-scan": "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)",
      },
      backgroundSize: {
        "grid-pattern": "50px 50px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
