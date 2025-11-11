// src/components/organisms/TopNavBar.tsx
"use client"

import { Box, Burger, Drawer, Flex, Group, ScrollArea } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import {
  IconApps,
  IconArticle,
  IconBooks,
  IconBrandPatreon,
  IconBriefcase,
  IconFolder,
  IconGitBranch,
  IconSignature,
  IconTag,
  IconVideo,
} from "@tabler/icons-react"
import { useTranslations } from "next-intl"
import Logo from "../atoms/Logo"
import CurriculumVitae from "../molecules/CurriculumVitae"
import { DesktopLinks } from "../molecules/DesktopLinks"
import Search from "./Search"
import styles from "./TopNavBar.module.css"
import UserMenu from "./UserMenu"

/*
 * TopNavBar Component
 * -------------------
 * The TopNavBar component is a navigation bar component that is used to display the navigation links.
 * It is used in the AppHeader component.
 */
export default function TopNavBar() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false)
  const t = useTranslations("messages")

  // Allowed hrefs for the megamenu links
  type AllowedHref
    = | "/"
      | "/blog"
      | "/tags"
      | "/categories"
      | "/repositories"
      | "/works"
      | "/courses"
      | "/hire-me"
      | "/guestbook"
      | "/resources"

  // Megamenu link type
  const megamenuLinks: {
    label: string
    to?: AllowedHref
    icon?: React.ReactNode
    children?: {
      label: string
      description: string
      to?: AllowedHref
      icon?: React.ReactNode
      urlExternal?: string
      target?: string
    }[]
  }[] = [
    {
      label: t("top-nav-bar.main-menu.home.label"),
      to: "/",
    },
    {
      label: t("top-nav-bar.main-menu.pages.label"),
      children: [
        {
          label: t("top-nav-bar.main-menu.pages.items.works.label"),
          description: t("top-nav-bar.main-menu.pages.items.works.description"),
          to: "/works",
          icon: <IconApps size={18} />,
        },
        {
          label: t("top-nav-bar.main-menu.pages.items.resources.label"),
          description: t("top-nav-bar.main-menu.pages.items.resources.description"),
          to: "/resources",
          icon: <IconBooks size={18} />,
        },
        {
          label: t("top-nav-bar.main-menu.pages.items.hire.label"),
          description: t("top-nav-bar.main-menu.pages.items.hire.description"),
          to: "/hire-me",
          icon: <IconBriefcase size={18} />,
        },
        {
          label: t("top-nav-bar.main-menu.pages.items.repositories.label"),
          description: t("top-nav-bar.main-menu.pages.items.repositories.description"),
          to: "/repositories",
          icon: <IconGitBranch size={18} />,
        },
        {
          label: t("top-nav-bar.main-menu.pages.items.tags.label"),
          description: t("top-nav-bar.main-menu.pages.items.tags.description"),
          to: "/tags",
          icon: <IconTag size={18} />,
        },
        {
          label: t("top-nav-bar.main-menu.pages.items.categories.label"),
          description: t("top-nav-bar.main-menu.pages.items.categories.description"),
          to: "/categories",
          icon: <IconFolder size={18} />,
        },
      ],
    },
    {
      label: t("top-nav-bar.main-menu.tutorials.label"),
      children: [
        {
          label: t("top-nav-bar.main-menu.tutorials.items.courses.label"),
          description: t("top-nav-bar.main-menu.tutorials.items.courses.description"),
          to: "/courses",
          icon: <IconVideo size={18} />,
        },
        {
          label: t("top-nav-bar.main-menu.tutorials.items.blog.label"),
          description: t("top-nav-bar.main-menu.tutorials.items.blog.description"),
          to: "/blog",
          icon: <IconArticle size={18} />,
        },
      ],
    },
    {
      label: t("top-nav-bar.main-menu.communities.label"),
      children: [
        {
          label: t("top-nav-bar.main-menu.communities.items.guestbook.label"),
          description: t("top-nav-bar.main-menu.communities.items.guestbook.description"),
          to: "/guestbook",
          icon: <IconSignature size={18} />,
        },
        {
          label: t("top-nav-bar.main-menu.communities.items.patreon.label"),
          description: t("top-nav-bar.main-menu.communities.items.patreon.description"),
          icon: <IconBrandPatreon size={18} />,
          urlExternal: "https://patreon.com/marprezd?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink",
          target: "_blank",
        },
      ],
    },
  ]

  return (
    <Box className={styles.navContainer}>
      <Group className={styles.navGroup}>
        <Logo />
        <Flex className={styles.desktopNav} component="nav">
          {megamenuLinks.map(item => (
            <DesktopLinks key={item.label} item={item} />
          ))}
        </Flex>
        <Flex className={styles.actionsContainer}>
          <UserMenu />
          <Search />
          <CurriculumVitae />
        </Flex>
        <Burger
          className={styles.burgerButton}
          opened={drawerOpened}
          onClick={toggleDrawer}
          hiddenFrom="sm"
          aria-label="Menu Navigation"
        />
      </Group>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        position="left"
        title="Menu Navigation"
      >
        <ScrollArea
          h="calc(100vh - 60px)"
          mx="-md"
        >
          Home
        </ScrollArea>
      </Drawer>
    </Box>
  )
}
