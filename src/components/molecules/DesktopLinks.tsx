"use client"

import {
  Box,
  Button,
  Flex,
  Popover,
  rem,
  Text,
  ThemeIcon,
} from "@mantine/core"
import { IconChevronDown } from "@tabler/icons-react"
import { useSelectedLayoutSegment } from "next/navigation"
import { useState } from "react"
import { Link } from "@/i18n/navigation"
import styles from "./DesktopLinks.module.css"

// Base type for menu items
interface MenuItemBase {
  label: string
  description?: string
  icon?: React.ReactNode
  isActive?: boolean
  hasChildren?: boolean
  opened?: boolean
  onToggle?: () => void
}

// Type for child items
type MenuItemChild = Omit<MenuItemBase, "children" | "opened" | "onToggle"> & {
  to?: Parameters<typeof Link>[0]["href"]
  urlExternal?: string
  target?: string
}

// Main menu item type
type MenuItem = MenuItemBase & {
  to?: Parameters<typeof Link>[0]["href"]
  children?: MenuItemChild[]
}

interface DesktopLinksProps {
  item: MenuItem
}

export function DesktopLinks({ item }: DesktopLinksProps) {
  const segment = useSelectedLayoutSegment()
  const pathname = segment ? `/${segment}` : "/"
  const [opened, setOpened] = useState(false)

  const isActive = item.isActive ?? (item.to ? pathname === item.to : false)

  const content = (
    <Flex
      align="center"
      gap={rem(8)}
    >
      <Text>{item.label}</Text>
      {item.children && (
        <Box
          component={IconChevronDown}
          w={16}
          h={16}
          aria-hidden="true"
          className={`${styles.chevronIcon} ${opened ? styles.chevronOpen : ""}`}
        />
      )}
    </Flex>
  )

  return (
    <Popover
      opened={opened}
      onChange={(e) => {
        if (item.children) {
          setOpened(e)
        }
      }}
      position="bottom"
      withArrow
      withinPortal
    >
      <Popover.Target>
        {item.children
          ? (
              <Button
                variant="subtle"
                size="sm"
                color="cyan"
                className={`${styles.triggerButton} ${isActive ? styles.triggerActive : ""}`}
                aria-haspopup
                aria-expanded={opened}
                onClick={() => setOpened(!opened)}
              >
                {content}
              </Button>
            )
          : (
              <Button
                component={Link}
                variant="subtle"
                size="sm"
                color="cyan"
                className={`${styles.triggerButton} ${isActive ? styles.triggerActive : ""}`}
                href={item.to!}
              >
                {content}
              </Button>
            )}
      </Popover.Target>

      {item.children && (
        <Popover.Dropdown
          w={rem(576)}
          p={rem(16)}
        >
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: rem(12),
            }}
          >
            {item.children.map((child) => {
              const isChildActive = child.to === pathname

              const restProps = {
                className: `${styles.linkItem} ${isChildActive ? styles.linkItemActive : "var(--mantine-color-gray-1)"}`,
                onClick: () => item.children && setOpened(false),
              }

              const linkContent = (
                <>
                  <Flex
                    align="center"
                    gap={rem(8)}
                    mb={rem(4)}
                  >
                    {child.icon && (
                      <ThemeIcon
                        variant="light"
                        radius="md"
                        size="lg"
                        color="cyan"
                      >
                        {child.icon}
                      </ThemeIcon>
                    )}
                    <Text fw={500}>{child.label}</Text>
                  </Flex>
                  {child.description && (
                    <Text className={styles.linkItemDescription}>
                      {child.description}
                    </Text>
                  )}
                </>
              )

              if (!child.urlExternal && !child.to) {
                return (
                  <Box
                    key={child.label}
                    {...restProps}
                  >
                    {linkContent}
                  </Box>
                )
              }

              return child.urlExternal
                ? (
                    <Box
                      key={child.label}
                      component="a"
                      href={child.urlExternal}
                      target="_blank"
                      {...restProps}
                    >
                      {linkContent}
                    </Box>
                  )
                : (
                    <Box
                      key={child.label}
                      component={Link}
                      href={child.to!}
                      {...restProps}
                    >
                      {linkContent}
                    </Box>
                  )
            })}
          </Box>
        </Popover.Dropdown>
      )}
    </Popover>
  )
}
