import type { Config } from "tailwindcss";

export default {
  important: true,
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px"
    },
    extend: {
      colors: {
        background: "#ffffff",
        "background-2": "#F4F3F6",
        foreground: "var(--foreground)",

        primary: "#2E6343",
        "primary-light-2": "#eaf5ee",
        "primary-light-1": "#a3ccaf",
        "primary-main": "#2E6343",
        "primary-dark-1": "#204832",
        "primary-dark-2": "#122c21",

        secondary: "#8b5cf6",
        "secondary-light-2": "#f5f3ff",
        "secondary-light-1": "#ddd6fe",
        "secondary-main": "#8b5cf6",
        "secondary-dark-1": "#6d28d9",
        "secondary-dark-2": "#4c1d95",

        success: "#10b981",
        "success-light-2": "#ecfdf5",
        "success-light-1": "#a7f3d0",
        "success-main": "#10b981",
        "success-dark-1": "#047857",
        "success-dark-2": "#064e3b",

        error: "#ef4444",
        "error-light-2": "#fef2f2",
        "error-light-1": "#fecaca",
        "error-main": "#ef4444",
        "error-dark-1": "#b91c1c",
        "error-dark-2": "#7f1d1d",

        warning: "#f59e0b",
        "warning-light-2": "#fffbeb",
        "warning-light-1": "#fde68a",
        "warning-main": "#f59e0b",
        "warning-dark-1": "#b45309",
        "warning-dark-2": "#78350f"
      }
    }
  },
  darkMode: "class",
  plugins: []
} satisfies Config;
