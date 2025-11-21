// src/components/organisms/Profile/Profile.tsx
"use client"

import {
  Anchor,
  Badge,
  Blockquote,
  Box,
  Grid,
  Group,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core"
import { IconBrandBluesky, IconBrandDiscord, IconBrandGithub, IconBrandUpwork, IconQuote } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import CloudImage from "../../atoms/CloudImage"

// TODO: Add more job networks
const jobNetworks = [
  {
    title: "Upwork",
    url: "https://www.upwork.com/freelancers/~01a1f8e2b1102f34ef?mp_source=share",
    icon: IconBrandUpwork,
  },
]

// TODO: Add more social networks
const socialNetworks = [
  {
    title: "GitHub",
    url: "https://github.com/marprezd",
    icon: IconBrandGithub,
  },
  {
    title: "Bluesky",
    url: "https://bsky.app/profile/marprezd.bsky.social",
    icon: IconBrandBluesky,
  },
  {
    title: "Discord",
    url: "https://discord.gg/3ffsbTzR",
    icon: IconBrandDiscord,
  },
]

/**
 * Profile Component
 *
 * A card component displaying user profile information including:
 * - User avatar
 * - User name
 * - User experience
 * - Job networks
 *
 * Integrates with next-intl for internationalization.
 */
export default function Profile() {
  const t = useTranslations("messages")
  const yearsExperience = Math.floor((new Date().getTime() - new Date("2019-08-13").getTime()) / 3.15576e10)

  return (
    <Grid.Col span={{ base: 12 }}>
      <Blockquote
        icon={(
          <IconQuote
            size={64}
            style={{ transform: "rotate(180deg)" }}
          />
        )}
        color="gray"
        style={{
          background: `light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-8))`,
        }}
        mt="lg"
      >
        <Stack gap="xs">
          <Text size="sm" fw={600} c="light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-3))" tt="uppercase">
            {t("home.profile.title")}
          </Text>
          <Text
            c="light-dark(var(--mantine-color-gray-8), var(--mantine-color-gray-5))"
            size="sm"
          >
            {t("home.profile.description")}
          </Text>
        </Stack>

        <Box mt="md">
          <Group align="center">
            <CloudImage
              alt="Mario Pérez"
              width="57"
              height="57"
              src="marprez-dev/profile/mariop-profile_ittjja.webp"
              crop={{
                type: "fill",
              }}
              quality="auto"
              loading="lazy"
              style={{
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                borderRadius: "9999px",
                width: "57px",
                height: "57px",
              }}
              gravity="faces"
            />
            <Stack gap={0}>
              <Text fw={600} size="sm" c="light-dark(var(--mantine-color-gray-9), var(--mantine-color-gray-5))">
                Mario Pérez
              </Text>
              <Text size="xs" c="light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-6))">
                {t("home.profile.profession")}
                {" "}
                |
                {" "}
                {t("home.profile.experience", { years: yearsExperience })}
              </Text>
            </Stack>
          </Group>
        </Box>

        <Group mt={{ base: 32, lg: 56 }} justify="space-between" wrap="wrap">
          <Group gap="xs">
            <Text size="xs" c="light-dark(var(--mantine-color-gray-8), var(--mantine-color-gray-6))">
              {t("home.profile.hire-me")}
            </Text>
            <Group
              gap={4}
              px={6}
              py={4}
            >
              {/* Job networks */}
              {jobNetworks.map(({ title, url, icon: Icon }) => (
                <Badge
                  key={title}
                  variant="default"
                  size="md"
                  radius="sm"
                  leftSection={<Icon size={16} />}
                  component="a"
                  href={url}
                  target="_blank"
                  rel="noopener"
                  fw={400}
                >
                  {title}
                </Badge>
              ))}
            </Group>
          </Group>
          {/* Social networks */}
          <Group gap="xs">
            {socialNetworks.map(({ title, url, icon: Icon }) => (
              <Anchor
                key={title}
                href={url}
                target="_blank"
                rel="noopener"
                aria-label={title}
              >
                <ThemeIcon
                  size="sm"
                  radius="md"
                  color="cyan"
                  variant="light"
                >
                  <Icon size={16} />
                </ThemeIcon>
              </Anchor>
            ))}
          </Group>
        </Group>
      </Blockquote>
    </Grid.Col>
  )
}
