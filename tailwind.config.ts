import type { Config } from "tailwindcss";

const budgetlyColors = {
  bg: "#020604",
  surface: "#05100A",
  header: "#05100A",
  card: "#0D1B12",
  hover: "#11271A",
  active: "#163522",
  green: "#35E27A",
  dark: "#169B4B",
  neon: "#72FFAD",
  lime: "#B7FF5A",
  cyan: "#38E8FF",
  soft: "rgba(101, 244, 154, 0.12)",
  text: "#F8FAFC",
  muted: "#CBD5E1",
  dim: "#7C8A99",
  border: "rgba(101, 244, 154, 0.12)",
  borderStrong: "rgba(101, 244, 154, 0.28)",
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
        glow: "0 0 28px rgba(114, 255, 173, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
