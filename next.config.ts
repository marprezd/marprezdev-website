import type { NextConfig } from "next"
import process from "node:process"
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"
import createNextIntlPlugin from "next-intl/plugin"

// add velite config
const isDev = process.argv.includes("dev")
const isBuild = process.argv.includes("build")
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = "1"
  import("velite").then(m => m.build({ watch: isDev, clean: !isDev }))
}

// Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com ajax.cloudflare.com static.cloudflareinsights.com;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src 'self';
  connect-src 'self' cloudflareinsights.com;
  font-src 'self';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  frame-src https://challenges.cloudflare.com
`

// Security Headers
const securityHeaders = {
  source: [
    {
      source: "/:path*",
      headers: [
        {
          key: "Content-Security-Policy",
          value: ContentSecurityPolicy,
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ],
    },
  ],
}

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
    ],
    qualities: [80],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            ...securityHeaders,
            key: "Cache-Control",
            value: "s-maxage=86400, stale-while-revalidate=59",
          },
        ],
      },
    ]
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
initOpenNextCloudflareForDev()
