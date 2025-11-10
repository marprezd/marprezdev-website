// src/components/organisms/skills/SoftSkills.tsx
import type { JSX } from "react"
import { Group, SimpleGrid, Text, ThemeIcon } from "@mantine/core"

/**
 * SoftSkills component displays a list of soft skills with icons
 * @param {object} props - Component props
 * @param {Array<{title: string}>} props.items - Array of soft skill items to display
 * @returns {JSX.Element} Rendered component
 */
export default function SoftSkills({ items }: { items: { title: string }[] }): JSX.Element {
  return (
    <SimpleGrid
      cols={{ base: 1, sm: 3, md: 4 }}
      spacing="xs"
      my="md"
    >
      {items.map((item, index) => (
        <Group
          key={index}
          gap="xs"
        >
          <ThemeIcon
            size={20}
            radius="md"
            color="cyan"
            variant="light"
          >
            <svg
              width={12}
              height={12}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </ThemeIcon>
          <Text
            fz={{ base: "xs", sm: "sm" }}
            style={{ color: "light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-6))" }}
          >
            {item.title}
          </Text>
        </Group>
      ))}
    </SimpleGrid>
  /*     <Group
      component="ul"
    >
      {items.map((item, index) => (
        <Group
          key={index}
          gap="sm"
          component="li"
        >
          <ThemeIcon
            size={20}
            radius="md"
            color="cyan"
            variant="light"
          >
            <svg
              width={12}
              height={12}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </ThemeIcon>
          <Text
            size="sm"
            style={{ color: "light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-6))" }}
          >
            {item.title}
          </Text>
        </Group>
      ))}
    </Group> */
  )
}
