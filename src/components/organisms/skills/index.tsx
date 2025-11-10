// src/components/organisms/skills/index.tsx
"use client"

import type { JSX } from "react"
import {
  Box,
  Container,
  Grid,
  Group,
  Space,
  Text,
  Title,
} from "@mantine/core"
import { IconDatabase, IconLanguage, IconSourceCode, IconTools } from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import {
  IconBrandAnaconda,
  IconBrandCpp,
  IconBrandDjango,
  IconBrandDocker,
  IconBrandFastApi,
  IconBrandFlask,
  IconBrandGit,
  IconBrandGraphql,
  IconBrandJava,
  IconBrandJavascript,
  IconBrandMarkdown,
  IconBrandMongodb,
  IconBrandNextJS,
  IconBrandPostgres,
  IconBrandPostman,
  IconBrandPython,
  IconBrandReactJS,
  IconBrandSupabase,
  IconBrandTailwindcs,
  IconBrandVSCode,
} from "@/components/atoms/Icons"
import HardSkills from "./HardSkills"
import SoftSkills from "./SoftSkills"

const technologies = [
  { title: "C++", type: "language", icon: <IconBrandCpp size={30} />, score: 10 },
  { title: "NextJS", type: "framework", icon: <IconBrandNextJS size={30} />, score: 60 },
  { title: "Postman", type: "tool", icon: <IconBrandPostman size={30} />, score: 90 },
  { title: "Python", type: "language", icon: <IconBrandPython size={30} />, score: 78 },
  { title: "Postgres", type: "database", icon: <IconBrandPostgres size={30} />, score: 70 },
  { title: "Javascript", type: "language", icon: <IconBrandJavascript size={30} />, score: 82 },
  { title: "Anaconda", type: "tool", icon: <IconBrandAnaconda size={30} />, score: 76 },
  { title: "ReactJS", type: "framework", icon: <IconBrandReactJS size={30} />, score: 75 },
  { title: "Django", type: "framework", icon: <IconBrandDjango size={30} />, score: 70 },
  { title: "Java", type: "language", icon: <IconBrandJava size={30} />, score: 60 },
  { title: "Docker", type: "tool", icon: <IconBrandDocker size={30} />, score: 63 },
  { title: "Markdown", type: "tool", icon: <IconBrandMarkdown size={30} />, score: 100 },
  { title: "VS Code", type: "tool", icon: <IconBrandVSCode size={30} />, score: 90 },
  { title: "Graphql", type: "tool", icon: <IconBrandGraphql size={30} />, score: 68 },
  { title: "Mongodb", type: "database", icon: <IconBrandMongodb size={30} />, score: 80 },
  { title: "Git", type: "tool", icon: <IconBrandGit size={30} />, score: 90 },
  { title: "Flask", type: "framework", icon: <IconBrandFlask size={30} />, score: 70 },
  { title: "Supabase", type: "database", icon: <IconBrandSupabase size={30} />, score: 76 },
  { title: "Tailwindcss", type: "tool", icon: <IconBrandTailwindcs size={30} />, score: 90 },
  { title: "FastAPI", type: "framework", icon: <IconBrandFastApi size={30} />, score: 72 },
]

// filter technologies by type
const languages = technologies.filter(tech => tech.type === "language")
const frameworks = technologies.filter(tech => tech.type === "framework")
const tools = technologies.filter(tech => tech.type === "tool")
const databases = technologies.filter(tech => tech.type === "database")

/**
 * Skills component displays a grid of soft skills and a list of hard skills
 * @returns {JSX.Element} Rendered component
 */
export default function Skills(): JSX.Element {
  const t = useTranslations("messages")
  const softSkills = [
    {
      title: t("home.skills.items.communication.title"),
    },
    {
      title: t("home.skills.items.teamwork.title"),
    },
    {
      title: t("home.skills.items.problem-solving.title"),
    },
    {
      title: t("home.skills.items.adaptability.title"),
    },
    {
      title: t("home.skills.items.time-management.title"),
    },
    {
      title: t("home.skills.items.critical-thinking.title"),
    },
    {
      title: t("home.skills.items.self-motivation.title"),
    },
    {
      title: t("home.skills.items.professional-ethics.title"),
    },
    {
      title: t("home.skills.items.empathy.title"),
    },
    {
      title: t("home.skills.items.proactivity.title"),
    },
  ]

  return (
    <Container
      size="md"
      py="xl"
    >
      <Grid>
        <Grid.Col span={{ base: 12 }}>
          <Group justify="space-between">
            <Box>
              <Title
                order={2}
                fz={{ base: "h3", md: "h2", lg: "h1" }}
                fw={700}
              >
                {t("home.skills.title")}
              </Title>
            </Box>
            <Box mt={{ base: 0, sm: "xs" }}>
              <Text
                c="light-dark(var(--mantine-color-gray-7), var(--mantine-color-gray-6))"
                size="sm"
                fw={600}
              >
                {t("home.skills.description")}
              </Text>
            </Box>
          </Group>
        </Grid.Col>
        <Grid.Col span={{ base: 12 }}>
          <SoftSkills items={softSkills} />
        </Grid.Col>
      </Grid>
      <Space h="xl" />
      <Grid>
        <Grid.Col span={12}>
          <HardSkills categories={
            [{
              value: "languages",
              label: t("home.skills.categories.languages"),
              icon: <IconLanguage size={22} color="var(--mantine-color-dimmed)" />,
              items: languages,
            }, {
              value: "frameworks",
              label: t("home.skills.categories.frameworks"),
              icon: <IconSourceCode size={22} color="var(--mantine-color-dimmed)" />,
              items: frameworks,
            }, {
              value: "tools",
              label: t("home.skills.categories.tools"),
              icon: <IconTools size={22} color="var(--mantine-color-dimmed)" />,
              items: tools,
            }, {
              value: "databases",
              label: t("home.skills.categories.databases"),
              icon: <IconDatabase size={22} color="var(--mantine-color-dimmed)" />,
              items: databases,
            }]
          }
          />
        </Grid.Col>
      </Grid>
    </Container>
  )
}
