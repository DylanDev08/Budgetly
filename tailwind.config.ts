import type { Config } from "tailwindcss";

const budgetlyColors = {
  bg: "#020604",
  surface: "#06110A",
  header: "#06110A",
  card: "#0B1710",
  hover: "#102318",
  green: "#2DD36F",
  dark: "#15803D",
  neon: "#65F49A",
  soft: "rgba(45, 211, 111, 0.12)",
  text: "#F8FAFC",
  muted: "#9CA3AF",
  dim: "#64748B",
  border: "rgba(74, 222, 128, 0.16)",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#38BDF8",
};

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        budget: budgetlyColors,
        budgetly: budgetlyColors,
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
