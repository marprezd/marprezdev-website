import type { Locale } from "next-intl"
import { Text } from "@mantine/core"
import { setRequestLocale } from "next-intl/server"
import { use } from "react"

export default function IndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)

  // Enable static rendering
  setRequestLocale(locale as Locale)

  return (
    <div>
      <Text>HomePage</Text>
    </div>
  )
}
