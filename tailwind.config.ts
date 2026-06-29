import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        budget: {
          bg: "#010302",
          surface: "#050A06",
          header: "#031609",
          card: "#0B120D",
          hover: "#102016",
          green: "#22C55E",
          neon: "#39FF88",
          dark: "#166534",
          soft: "rgba(34, 197, 94, 0.12)",
          text: "#F8FAFC",
          muted: "#94A3B8",
          dim: "#64748B",
          border: "rgba(34, 197, 94, 0.18)",
        },
      },
      boxShadow: {
        soft: "0 18px 50px rgba(0, 0, 0, 0.32)",
        glow: "0 0 28px rgba(34, 197, 94, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
