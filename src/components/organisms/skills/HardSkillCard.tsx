// src/components/organisms/skills/HardSkillCard.tsx
"use client"

import type { JSX } from "react"
import { Box, Card, GridCol, Group, Progress, Text, ThemeIcon } from "@mantine/core"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"

/**
 * HardSkillCard component displays a card with a hard skill
 * @param {object} props - Component props
 * @param {string} props.title - Title of the hard skill
 * @param {React.ReactNode} props.icon - Icon of the hard skill
 * @param {number} props.score - Score of the hard skill
 * @returns {JSX.Element} Rendered component
 */
export default function HardSkillCard({
  title,
  icon,
  score,
}: {
  title: string
  icon: React.ReactNode
  score: number
}): JSX.Element {
  const [value, setValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const t = useTranslations("messages.home.skills")

  // Animate progress bar on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setValue(score)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.2,
      },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [score])

  return (
    <GridCol
      ref={cardRef}
      span={{
        base: 12,
        sm: 6,
        md: 4,
        lg: 3,
      }}
    >
      <Card
        withBorder
        radius="lg"
        p="lg"
        h="100%"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexGrow: 1,
            gap: "0.5rem",
          }}
        >
          <ThemeIcon
            size="lg"
            radius="md"
            color="cyan"
            variant="default"
          >
            {icon}
          </ThemeIcon>
          <Text
            fw={500}
            c="light-dark(var(--mantine-color-gray-8), var(--mantine-color-gray-2))"
          >
            {title}
          </Text>
        </Box>

        <Group
          justify="space-between"
          align="center"
          fw={300}
          my="md"
          ff="monospace"
          style={{
            color: "light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-4))",
          }}
        >
          <Text fz="xs">
            {t("average")}
          </Text>
          <Text fz="xs">
            {score}
            %
          </Text>
        </Group>

        <Progress
          value={isVisible ? value : 0}
          size="sm"
          radius="xl"
          color="cyan"
          style={{ marginTop: "auto" }}
          transitionDuration={1000}
          aria-label={`${title} - Average: ${score}%`}
        />
      </Card>
    </GridCol>
  )
}
