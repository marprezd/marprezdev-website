import type { NextConfig } from "next"
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
initOpenNextCloudflareForDev()
