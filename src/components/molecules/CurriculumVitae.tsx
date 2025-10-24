// src/components/molecules/CurriculumVitae.tsx
"use client"

import {
  Box,
  ThemeIcon,
  Tooltip,
} from "@mantine/core"
import { IconFileCv } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import React from "react"

export default function CurriculumVitae() {
  const t = useTranslations("messages")
  const cv = t("top-nav-bar.action-menu.resume.tooltip.label")

  return (
    <Box>
      <Tooltip
        label={cv}
        withArrow
        arrowOffset={28}
        arrowSize={6}
      >
        <ThemeIcon
          variant="light"
          radius="lg"
          size="md"
          color="cyan"
          onClick={() => window.open("/resume/cv.pdf", "_blank")}
        >
          <IconFileCv style={{ width: "70%", height: "70%" }} />
        </ThemeIcon>
      </Tooltip>
    </Box>
  )
}
