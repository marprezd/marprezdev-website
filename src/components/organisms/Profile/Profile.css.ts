// src/components/organisms/Profile/Profile.css.ts
import { rem } from "@mantine/core"
import { style } from "@vanilla-extract/css"
import { themeVars } from "../../../../theme"

export const profileContainer = style({
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

export const profileBox = style({
  maxWidth: rem(800),
  margin: "0 auto",
})

export const profileGrid = style({
  alignItems: "center",
})
