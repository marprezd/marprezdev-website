import { style } from "@vanilla-extract/css"
import { themeVars } from "../../../../theme"

export const navContainer = style({
  height: "60px",
  padding: "0 var(--mantine-spacing-md)",
})

export const navGroup = style({
  height: "100%",
  justifyContent: "space-between",
  alignItems: "center",
})

export const desktopNav = style({
  "justifyContent": "center",
  "alignItems": "center",
  "flexDirection": "row",
  "gap": themeVars.spacing.xs,
  "flexWrap": "wrap",

  "@media": {
    [themeVars.smallerThan("sm")]: {
      display: "none",
    },
  },
})

export const actionsContainer = style({
  "height": "64%",
  "gap": themeVars.spacing.xs,
  "justifyContent": "center",
  "alignItems": "center",
  "flexDirection": "row",
  "flexWrap": "wrap",
  "padding": "0.1rem 0.3rem 0 0.3rem",
  "borderRadius": themeVars.radius.xl,

  "@media": {
    [themeVars.smallerThan("sm")]: {
      gap: themeVars.spacing.xs,
    },
  },
})

export const burgerButton = style({
  "@media": {
    [themeVars.largerThan("sm")]: {
      display: "none",
    },
  },
})
