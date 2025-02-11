import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";

export default {
  important: true,
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)"
      }
    }
  },
  darkMode: "class",
  plugins: [
    heroui({
      defaultTheme: "light",
      themes: {
        "bhalo-thaki-theme": {
          extend: "light",
          layout: {
            disabledOpacity: "0.3",
            radius: {
              small: "4px",
              medium: "6px",
              large: "8px"
            },
            borderWidth: {
              small: "1px",
              medium: "1px",
              large: "2px"
            },
            fontSize: {
              tiny: "12px",
              small: "14px",
              medium: "16px",
              large: "18px"
            },
            hoverOpacity: "0.9"
          },
          colors: {
            primary: {
              50: "#f0fdfa",
              100: "#ccfbf1",
              200: "#99f6e4",
              300: "#5eead4",
              400: "#2dd4bf",
              500: "#14b8a6",
              600: "#0d9488",
              700: "#0f766e",
              800: "#115e59",
              900: "#134e4a",
              DEFAULT: "#0f766e"
            },
            secondary: {
              50: "#f5f3ff",
              100: "#ede9fe",
              200: "#ddd6fe",
              300: "#c4b5fd",
              400: "#a78bfa",
              500: "#8b5cf6",
              600: "#7c3aed",
              700: "#6d28d9",
              800: "#5b21b6",
              900: "#4c1d95",
              DEFAULT: "#6d28d9"
            },
            warning: {
              50: "#fffbeb",
              100: "#fef3c7",
              200: "#fde68a",
              300: "#fcd34d",
              400: "#fbbf24",
              500: "#f59e0b",
              600: "#d97706",
              700: "#b45309",
              800: "#92400e",
              900: "#78350f",
              DEFAULT: "#f59e0b"
            },
            success: {
              50: "#ecfdf5",
              100: "#d1fae5",
              200: "#a7f3d0",
              300: "#6ee7b7",
              400: "#34d399",
              500: "#10b981",
              600: "#059669",
              700: "#047857",
              800: "#065f46",
              900: "#064e3b",
              DEFAULT: "#047857"
            },
            danger: {
              50: "#fef2f2",
              100: "#fee2e2",
              200: "#fecaca",
              300: "#fca5a5",
              400: "#f87171",
              500: "#ef4444",
              600: "#dc2626",
              700: "#b91c1c",
              800: "#991b1b",
              900: "#7f1d1d",
              DEFAULT: "#b91c1c"
            },
            default: {
              DEFAULT: "#e4e4e7"
            }
          }
        }
      }
    })
  ]
} satisfies Config;
