// theme.ts
"use client"

import { createTheme } from "@mantine/core"
import { themeToVars } from "@mantine/vanilla-extract"

// Theme configuration
export const theme = createTheme({
  fontFamily: "var(--font-geist-sans), sans-serif",
  fontFamilyMonospace: "var(--font-geist-mono), monospace",
  headings: {
    fontFamily: "var(--font-geist-sans), sans-serif",
  },
  colors: {
    cyan: [
      "oklch(98.4% 0.019 200.873)",
      "oklch(95.6% 0.045 203.388)",
      "oklch(91.7% 0.08 205.041)",
      "oklch(86.5% 0.127 207.078)",
      "oklch(78.9% 0.154 211.53)",
      "oklch(71.5% 0.143 215.221)",
      "oklch(60.9% 0.126 221.723)",
      "oklch(52% 0.105 223.128)",
      "oklch(45% 0.085 224.283)",
      "oklch(39.8% 0.07 227.392)",
      "oklch(30.2% 0.056 229.695)",
    ],
    pink: [
      "oklch(97.1% 0.014 343.198)",
      "oklch(94.8% 0.028 342.258)",
      "oklch(89.9% 0.061 343.231)",
      "oklch(82.3% 0.12 346.018)",
      "oklch(71.8% 0.202 349.761)",
      "oklch(65.6% 0.241 354.308)",
      "oklch(59.2% 0.249 0.584)",
      "oklch(52.5% 0.223 3.958)",
      "oklch(45.9% 0.187 3.815)",
      "oklch(40.8% 0.153 2.432)",
      "oklch(28.4% 0.109 3.907)",
    ],
  },
})

export const themeVars = themeToVars(theme)
