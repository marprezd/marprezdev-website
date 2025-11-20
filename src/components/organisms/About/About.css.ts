// src/components/organisms/About/About.css.ts
import { rem } from "@mantine/core"
import { style } from "@vanilla-extract/css"
import { themeVars } from "../../../../theme"

export const outerContainer = style({
  "paddingTop": rem(40),
  "paddingBottom": rem(40),
  "paddingInline": rem(28),

  "@media": {
    [themeVars.largerThan("sm")]: {
      paddingTop: rem(78),
      paddingBottom: rem(78),
      paddingInline: rem(38),
    },
  },
})

export const innerContainer = style({
  maxWidth: rem(900),
  margin: "0 auto",
})

export const aboutGrid = style({
  gap: rem(28),
})
