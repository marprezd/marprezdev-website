// src/components/organisms/Search.tsx
"use client"

import {
  Badge,
  Box,
  Divider,
  Group,
  Input,
  Kbd,
  Modal,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IconCalendar, IconClock, IconCommand, IconRefresh, IconSearch } from "@tabler/icons-react"
import { posts as data } from "@velite/content"
// import Fuse from "fuse.js"
import { useFormatter, useLocale, useNow, useTranslations } from "next-intl"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { createSearchIndex, highlightMatches, searchPosts } from "@/utils/fuse"
import styles from "./Search.module.css"

// Fuse.js configuration for fuzzy search
/* const fuseOptions = {
  keys: ["title", "excerpt", "tags", "categories"],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 3,
  includeMatches: true,
  shouldSort: true,
} */

/**
 * Search Component
 *
 * A global search component that allows users to search through blog posts
 * using fuzzy matching. Supports keyboard shortcuts and provides instant results.
 */
export default function Search() {
  // State Management
  const [search, setSearch] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [opened, { open, close }] = useDisclosure(false)
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)

  // Hooks
  const t = useTranslations("messages")
  const locale = useLocale()
  const router = useRouter()
  const format = useFormatter()
  const now = useNow({
    updateInterval: 1000 * 10,
  })

  // Filter posts by current locale
  const posts = useMemo(() => {
    return data.filter(post => post.language === locale)
  }, [data, locale])

  // Create search index
  const fuse = useMemo(() => createSearchIndex(posts), [posts])

  // Initialize Fuse.js with posts and options
  /*   const fuse = useMemo(() => {
    return new Fuse(posts, fuseOptions)
  }, [posts]) */

  // Search results using Fuse.js
  const results = searchPosts(fuse, search)

  // Handle search input change with debounce
  useEffect(() => {
    if (search.trim().length > 2) {
      setIsSearching(true)
      const timer = setTimeout(() => {
        setIsSearching(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [search])

  // Keyboard shortcut handler (Cmd+K / Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        open()
        setSearch("") // Reset search when opening
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open])

  /**
   * Handle post selection
   * @param slug - The slug of the selected post
   */
  const handleSelectPost = useCallback((slug: string) => {
    const path = {
      pathname: "/blog/[slug]" as const,
      params: { slug },
    }
    router.push(path)
    close()
    setSearch("")
  }, [router])

  // Command item component for keyboard shortcuts
  const CommandItem = (props: { label: string, keys: string[] }) => {
    return (
      <Group gap="xs">
        {props.label}
        {" "}
        <Kbd size="xs">{props.keys.join(" ")}</Kbd>
      </Group>
    )
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!opened)
        return

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault()
        setFocusedIndex((prev) => {
          if (e.key === "ArrowDown") {
            return prev < results.length - 1 ? prev + 1 : 0
          }
          else {
            return prev > 0 ? prev - 1 : results.length - 1
          }
        })
      }
      else if (e.key === "Enter") {
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < results.length) {
          handleSelectPost(results[focusedIndex].slug)
        }
      }
    }

    if (opened) {
      document.addEventListener("keydown", handleGlobalKeyDown)
    }

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown)
    }
  }, [opened, results.length])

  return (
    <Box>
      <Modal
        opened={opened}
        onClose={close}
        title={t("top-nav-bar.action-menu.search.title")}
        radius="md"
        overlayProps={{
          backgroundOpacity: 0.5,
          blur: 2,
        }}
        scrollAreaComponent={ScrollArea.Autosize}
        size="lg"
      >
        <TextInput
          label={t("top-nav-bar.action-menu.search.label")}
          placeholder={t("top-nav-bar.action-menu.search.placeholder")}
          description={
            (isSearching && t("top-nav-bar.action-menu.search.starting"))
            || (!isSearching && search.trim().length > 1 && search.trim().length < 3
              && t("top-nav-bar.action-menu.search.min-chars"))
            || (!isSearching && search.trim().length === 0
              && t("top-nav-bar.action-menu.search.type-to-search"))
            || (!isSearching && search.trim().length >= 3 && results.length === 0
              && t("top-nav-bar.action-menu.search.no-found"))
            || (!isSearching && search.trim().length >= 3 && results.length > 0
              && t("top-nav-bar.action-menu.search.results-count", { count: results.length }))
          }
          value={search}
          onChange={e => setSearch(e.target.value)}
          leftSection={<IconSearch size={14} />}
          rightSection={search !== "" ? <Input.ClearButton onClick={() => setSearch("")} /> : undefined}
          data-autofocus
          classNames={styles}
          inputWrapperOrder={["label", "input", "description"]}
        />
        {search.trim().length >= 3 && results.length > 0 && (
          <Stack className={styles.searchResultList}>
            {results.map((post, index) => (
              <Paper
                key={post.slug}
                id={`search-result-${index}`}
                className={styles.searchResultCard}
                withBorder
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleSelectPost(post.slug)
                  }
                }}
                onClick={() => handleSelectPost(post.slug)}
                aria-label={`${post.title}. ${post.excerpt || ""}`}
                style={{
                  outline: focusedIndex === index ? "2px solid var(--mantine-color-cyan-5)" : "none",
                  outlineOffset: "2px",
                }}
                onFocus={() => setFocusedIndex(index)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                <Stack gap="xs">
                  <Box component="header">
                    <Title size="h4">
                      {highlightMatches(post.title, post.matches?.filter(m => m.key === "title"))}
                    </Title>
                  </Box>
                  {post.excerpt && (
                    <Text
                      className={styles.searchResultExcerpt}
                      lineClamp={2}
                    >
                      {highlightMatches(post.excerpt, post.matches?.filter(m => m.key === "excerpt"))}
                    </Text>
                  )}
                  <Box component="footer">
                    <Group gap="xs">
                      {post.lastModified && post.lastModified !== post.date
                        ? (
                            <Badge
                              variant="default"
                              leftSection={<IconRefresh size={14} />}
                              color="gray"
                              size="sm"
                              className={styles.searchResultBadge}
                            >
                              <time dateTime={post.lastModified}>
                                {format.relativeTime(new Date(post.lastModified), now)}
                              </time>
                            </Badge>
                          )
                        : (
                            <Badge
                              variant="default"
                              leftSection={<IconCalendar size={14} />}
                              color="gray"
                              size="sm"
                              className={styles.searchResultBadge}
                            >
                              <time dateTime={post.date}>
                                {format.relativeTime(new Date(post.date), now)}
                              </time>
                            </Badge>
                          )}
                      <Divider orientation="vertical" />
                      <Badge
                        variant="default"
                        leftSection={<IconClock size={14} />}
                        color="gray"
                        size="sm"
                        className={styles.searchResultBadge}
                      >
                        {t("blog.reading-time.mins", { minutes: post.metadata.readingTime })}
                      </Badge>
                      <Divider orientation="vertical" />
                      {post.tags?.length > 0 && (
                        <>
                          {post.tags.slice(0, 3).map(tag => (
                            <Badge
                              key={tag}
                              variant="dot"
                              color="cyan"
                              size="sm"
                              className={styles.searchResultBadge}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </>
                      )}
                    </Group>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
        <Group
          className={styles.searchCommand}
          gap="xs"
        >
          <CommandItem label={t("top-nav-bar.action-menu.search.close")} keys={["Esc"]} />
          <CommandItem label={t("top-nav-bar.action-menu.search.move-to-top")} keys={["↑"]} />
          <CommandItem label={t("top-nav-bar.action-menu.search.move-to-bottom")} keys={["↓"]} />
          <CommandItem label={t("top-nav-bar.action-menu.search.select")} keys={["⏎"]} />
        </Group>
      </Modal>
      <Tooltip
        label={t("top-nav-bar.action-menu.search.tooltip.label")}
        withArrow
        arrowOffset={28}
        arrowSize={6}
        radius="md"
      >
        <ThemeIcon
          variant="light"
          radius="lg"
          size="md"
          color="cyan"
          onClick={open}
        >
          <IconCommand style={{ width: "70%", height: "70%" }} />
        </ThemeIcon>
      </Tooltip>
    </Box>
  )
}
