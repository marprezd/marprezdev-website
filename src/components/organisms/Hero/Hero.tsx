import { Button, Container, Group, rem, Stack, Text, Title } from "@mantine/core"
import { IconBrandGithub } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import * as styles from "./Hero.css"

export default function Hero() {
  const t = useTranslations("messages")
  const githubUrl = "https://www.github.com/marprezd"

  return (
    <Container size="lg">
      <Stack
        align="center"
        gap="md"
        mt="md"
        py={{ base: rem(70), sm: rem(90), md: rem(100), lg: rem(120) }}
        px={{ base: rem(1), sm: rem(50), md: rem(60), lg: rem(50) }}
      >
        {/* Title and description */}
        {t.rich("home.hero.title", {
          h1: chunks => (
            <Title
              className={styles.title}
              order={1}
              fz={{
                base: rem(25),
                sm: rem(34),
                md: rem(42),
              }}
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
          className={styles.description}
          fz={{
            base: "sm",
            sm: "md",
          }}
          style={{
            color: `light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-6))`,
          }}
        >
          {t("home.hero.description")}
        </Text>

        <Group
          justify="center"
          gap="sm"
        >
          <Button
            component={Link}
            href="/blog"
            size="sm"
            radius="xl"
            variant="light"
            color="cyan"
          >
            {t("home.hero.started")}
          </Button>

          <Button
            component="a"
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
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
