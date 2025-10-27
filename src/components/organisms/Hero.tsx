import { Button, Container, Group, rem, Stack, Text, Title } from "@mantine/core"
import { IconBrandGithub } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

export default function Hero() {
  const t = useTranslations("messages")
  const githubUrl = "https://www.github.com/marprezd"

  return (
    <Container size="lg">
      <Stack
        align="center"
        gap="md"
        mt="md"
        py={{ base: rem(50), sm: rem(80), md: rem(100), lg: rem(120) }}
        px={{ base: rem(1), sm: rem(50), md: rem(60), lg: rem(50) }}
      >
        {/* Title and description */}
        {t.rich("home.hero.title", {
          h1: chunks => (
            <Title
              ta="center"
              fz={{
                base: rem(30),
                sm: rem(36),
                md: rem(48),
                lg: rem(60),
              }}
              fw={800}
            >
              {chunks}
            </Title>
          ),
          span: chunks => (
            <Text
              component="span"
              fz="inherit"
              variant="gradient"
              gradient={{
                from: "teal",
                to: "cyan",
                deg: 90,
              }}
              fw={800}
            >
              {chunks}
            </Text>
          ),
        })}

        <Text
          ta="center"
          size="md"
          style={{ color: `light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-6))` }}
          maw={600}
        >
          {t("home.hero.description")}
        </Text>

        <Group
          justify="center"
          gap="sm"
        >
          <Button
            component={Link}
            size="md"
            radius="xl"
            variant="filled"
            href="/blog"
            color="cyan"
          >
            {t("home.hero.started")}
          </Button>

          <Button
            component="a"
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="md"
            radius="xl"
            variant="default"
            leftSection={<IconBrandGithub size={18} />}
          >
            Github
          </Button>
        </Group>
      </Stack>
    </Container>
  )
}
