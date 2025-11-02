import type { Locale } from "next-intl"
import { Box } from "@mantine/core"
import { setRequestLocale } from "next-intl/server"
import { use } from "react"
import Hero from "@/components/organisms/Hero"

export default function IndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)

  // Enable static rendering
  setRequestLocale(locale as Locale)

  return (
    <Box>
      <Hero />
    </Box>
  )
}
