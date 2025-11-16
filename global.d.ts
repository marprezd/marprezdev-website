import type messages from "./messages/en.json"
import type { formats } from "@/i18n/request"
import type { routing } from "@/i18n/routing"

/**
 * Next-intl configuration
 */
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
    Formats: typeof formats
  }
}

/**
 * CSS module declaration
 */
declare module "*.css" {
  const content: { [className: string]: string }
  export default content
}
