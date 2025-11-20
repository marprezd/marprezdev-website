// src/components/atoms/Logo.tsx
import { Avatar, Box, Group, Text } from "@mantine/core"
import Link from "next/link"
import React from "react"

export default function Logo() {
  return (
    <Box>
      <Group gap="xs">
        <Avatar
          src="/images/marprezd-profile.webp"
          name="Mario Pérez"
          alt="Mario Pérez"
          color="initials"
          variant="transparent"
          size="md"
          radius="xl"
          component={Link}
          href="/"
        />
        <Text
          fw={600}
          fs="xl"
          display={{ base: "none", lg: "block" }}
        >
          marprezd
        </Text>
      </Group>
    </Box>
  )
}
