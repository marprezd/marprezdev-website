// src/components/organisms/Hero/Hero.css.ts
import { style } from "@vanilla-extract/css"
// import { themeVars } from "../../../../theme"

export const title = style({
  textAlign: "center",
  fontWeight: 800,
  letterSpacing: "0.05rem",
})

export const description = style({
  textAlign: "center",
  fontWeight: 400,
  maxWidth: "600px",
  margin: "0 auto",
})
