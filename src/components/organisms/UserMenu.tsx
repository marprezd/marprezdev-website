// src/components/organisms/UserMenu.tsx
"use client"

import type { Locale } from "next-intl"
import {
  Box,
  Divider,
  Menu,
  ThemeIcon,
  useMantineColorScheme,
} from "@mantine/core"
import {
  IconAdjustments,
  IconCheck,
  IconDeviceDesktop,
  IconMoonStars,
  IconSun,
} from "@tabler/icons-react"
import { posts } from "@velite/content"
import { useTranslations } from "next-intl"
import { usePathname as itemPathname, useParams } from "next/navigation"
import React from "react"
import {
  IconFlagEs,
  IconFlagFr,
  IconFlagGb,
  IconFlagTr,
} from "@/components/atoms/Icons"
import { usePathname, useRouter } from "@/i18n/navigation"

/**
 * Mapping of supported languages with their display names and icons
 */
const LANGUAGE_MAP = {
  en: { name: "English", icon: IconFlagGb },
  es: { name: "Español", icon: IconFlagEs },
  fr: { name: "Français", icon: IconFlagFr },
  tr: { name: "Türkçe", icon: IconFlagTr },
} as const

/**
 * UserMenu Component
 *
 * A dropdown menu providing access to user preferences including:
 * - Language selection
 * - Theme selection (light/dark/system)
 *
 * Integrates with next-intl for internationalization.
 */
export default function UserMenu() {
  const { setColorScheme, colorScheme } = useMantineColorScheme()
  const t = useTranslations("messages")
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()
  const singleItemPathname = itemPathname()
  const locale = useParams().locale as Locale

  /**
   * Handles language change and updates the URL with the new locale
   * @param lang - The target language code
   */
  const handleTranslationPath = (lang: Locale) => {
    if (lang === locale)
      return

    const nextLocale = lang
    const slug = singleItemPathname.substring(singleItemPathname.lastIndexOf("/") + 1)

    // Handle blog post language switching
    if (pathname?.includes("/blog/[slug]")) {
      const post = posts.find(post => post.slugAsParams === slug)
      const postLang = post?.otherLanguages?.find(obj => obj.code === nextLocale)
      const nextSlug = postLang?.slug

      if (nextSlug) {
        router.push(
          { pathname: "/blog/[slug]", params: { slug: nextSlug } },
          { locale: nextLocale },
        )
        return
      }
    }

    // Handle category pages
    if (pathname.includes("/categories/")) {
      router.push(
        { pathname: "/categories/[category]", params: { category: slug } },
        { locale: nextLocale },
      )
      return
    }

    // Handle tag pages
    if (pathname.includes("/tags")) {
      router.push(
        { pathname: "/tags/[tag]", params: { tag: slug } },
        { locale: nextLocale },
      )
      return
    }

    // Default route handling
    // @ts-expect-error -- TypeScript will validate that only known `params`
    router.push({ pathname, params }, { locale: nextLocale })
  }

  return (
    <Box>
      <Menu
        shadow="md"
        width={200}
        trigger="click-hover"
        openDelay={100}
        closeDelay={400}
        offset={10}
        withArrow
        radius="md"
      >
        <Menu.Target>
          <ThemeIcon
            variant="light"
            radius="lg"
            size="md"
            color="cyan"
          >
            <IconAdjustments style={{ width: "70%", height: "70%" }} />
          </ThemeIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>
            {t("top-nav-bar.action-menu.user-menu.language.label")}
          </Menu.Label>
          {Object.entries(LANGUAGE_MAP).map(([code, { name, icon: Icon }]) => (
            <Menu.Item
              key={code}
              onClick={() => handleTranslationPath(code as Locale)}
              leftSection={<Icon width={14} height={14} />}
              rightSection={code === locale ? <IconCheck width={14} height={14} /> : null}
            >
              {name}
            </Menu.Item>
          ))}
          <Divider />
          <Menu.Label>
            {t("top-nav-bar.action-menu.user-menu.theme.label")}
          </Menu.Label>
          {[
            { modeKey: "light", icon: IconSun },
            { modeKey: "dark", icon: IconMoonStars },
            { modeKey: "auto", icon: IconDeviceDesktop },
          ].map(({ modeKey, icon: Icon }) => (
            <Menu.Item
              key={modeKey}
              onClick={() => setColorScheme(modeKey as "light" | "dark" | "auto")}
              leftSection={<Icon width={14} height={14} />}
              rightSection={colorScheme === modeKey ? <IconCheck width={14} height={14} /> : null}
            >
              {t(`top-nav-bar.action-menu.user-menu.theme.${modeKey as "light" | "dark" | "auto"}`)}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </Box>
  )
}
