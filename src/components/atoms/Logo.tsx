// src/components/atoms/Logo.tsx
import { Avatar, Box, Group, Text } from "@mantine/core"
import Link from "next/link"
import React from "react"

export default function Logo() {
  return (
    <Box>
      <Group gap="xs">
        <Avatar
          src="https://res.cloudinary.com/dieoeaoiy/image/upload/bo_0px_solid_rgb:ffffff,c_fill,f_auto,g_face:auto,h_32,o_100,q_auto:best,r_0,w_32/v1662047991/profile_uezzbj.jpg"
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
