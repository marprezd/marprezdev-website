// src/components/organisms/skills/HardSkills.tsx
"use client"

import type { JSX } from "react"
import { Accordion, Grid } from "@mantine/core"
import HardSkillCard from "./HardSkillCard"

/**
 * HardSkills component displays a grid of hard skills with icons
 * @param {object} props - Component props
 * @param {Array<{value: string, label: string, icon: React.ReactNode, items: { title: string, icon: React.ReactNode, score: number }[]}>} props.categories - Array of hard skill categories to display
 * @returns {JSX.Element} Rendered component
 */
export default function HardSkills({
  categories,
}: {
  categories: {
    value: string
    label: string
    icon: React.ReactNode
    items: { title: string, icon: React.ReactNode, score: number }[]
  }[]
}): JSX.Element {
  return (
    <Accordion
      defaultValue={categories[0]?.value}
      w="100%"
      variant="filled"
      transitionDuration={700}
    >
      {categories.map(({ value, label, icon, items }) => (
        <Accordion.Item key={value} value={value}>
          <Accordion.Control aria-label={value} icon={icon}>
            {label}
          </Accordion.Control>
          <Accordion.Panel>
            <Grid gutter={{ base: "md", md: "lg" }} py="md">
              {items.map((tech, index) => (
                <HardSkillCard
                  key={index}
                  title={tech.title}
                  icon={tech.icon}
                  score={tech.score}
                />
              ))}
            </Grid>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  )
}
