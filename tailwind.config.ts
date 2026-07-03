import type { Config } from "tailwindcss";

const budgetlyColors = {
  bg: "#030604",
  surface: "#07100C",
  header: "#06110C",
  card: "#0A1510",
  hover: "#102019",
  active: "#123322",
  green: "#00C86F",
  dark: "#008F4E",
  neon: "#66F29A",
  lime: "#C6FF4A",
  cyan: "#29D6C8",
  soft: "rgba(0, 200, 111, 0.13)",
  text: "#F4FFF8",
  muted: "#B7C9BE",
  dim: "#718278",
  border: "rgba(132, 255, 184, 0.13)",
  borderStrong: "rgba(132, 255, 184, 0.3)",
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
        soft: "0 18px 48px rgba(0, 0, 0, 0.38)",
        glow: "0 0 26px rgba(0, 200, 111, 0.24)",
      },
    },
  },
  plugins: [],
};

export default config;
