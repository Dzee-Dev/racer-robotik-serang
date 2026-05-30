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
        brand: {
          bg: "#070d19",
          navy: "#0f172a",
          dark: "#0b1329",
          cyan: "#00f0ff",
          blue: "#3b82f6",
          emerald: "#10b981",
          rose: "#f43f5e",
          purple: "#a855f7",
          amber: "#f59e0b",
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.25)',
        'glow-cyan-lg': '0 0 35px rgba(0, 240, 255, 0.45)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.25)',
        'glass': 'inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "grid-pattern": "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;

