// src/app/[locale]/layout.tsx
import {
  AppShell,
  AppShellFooter,
  AppShellHeader,
  AppShellMain,
  rem,
} from "@mantine/core"
import { hasLocale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import BaseLayout from "@/components/BaseLayout"
import TopNavBar from "@/components/organisms/TopNavBar"
import { routing } from "@/i18n/routing"

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Ensure that the incoming `locale` is valid
  const locale = (await params).locale

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  return (
    <BaseLayout locale={locale}>
      <AppShell
        padding="md"
        header={{ height: 60 }}
        transitionDuration={500}
        transitionTimingFunction="ease"
      >
        <AppShellHeader>
          <TopNavBar />
        </AppShellHeader>
        <AppShellMain
          pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}
          px="0"
        >
          {children}
        </AppShellMain>
        <AppShellFooter>
          <div>Footer</div>
        </AppShellFooter>
      </AppShell>
    </BaseLayout>
  )
}
