// src/app/[locale]/page.tsx
import type { Locale } from "next-intl"
import { Box } from "@mantine/core"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { use } from "react"
import Hero from "@/components/organisms/Hero"
import ProfileCard from "@/components/organisms/ProfileCard"
import Skills from "@/components/organisms/skills/index"
import { host } from "@/utils/hostConfig"

export async function generateMetadata({ params}: { params: Promise<{ locale: Locale }> }) {
  const locale = (await params).locale
  const t = await getTranslations({ locale, namespace: "messages.metadata.homepage" })

  return {
    metadataBase: new URL(host),
    title: t("title"),
    description: t("description"),
    generator: t("generator"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      siteName: t("title"),
      url: "/en",
      images: {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
      },
      locale,
    },
    twitter: {
      title: t("title"),
      description: t("description"),
      card: "summary_large_image",
      site: "@marprezd",
      creator: "@marprezd",
      images: {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
      },
      locale,
    },
    alternates: {
      canonical: "/en",
      languages: {
        es: `${host}/es`,
        tr: `${host}/tr`,
        fr: `${host}/fr`,
      },

    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  }
}

export default function IndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)

  // Enable static rendering
  setRequestLocale(locale as Locale)

  return (
    <Box>
      <Hero />
      <ProfileCard />
      <Skills />
    </Box>
  )
}
