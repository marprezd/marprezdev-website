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
 * CSS module declarations
 */
declare module "*.module.css" {
  const classes: { readonly [className: string]: string }
  export default classes
}

declare module "*.css" {
  // Generic side-effect import (e.g. import "./styles.css") or non-module
  // CSS. Consumers may import as a string or just perform a side-effect import.
  const css: { [className: string]: string } | string
  export default css
}

// Explicit declaration for Mantine's side-effect stylesheet so editors/TS
// servers recognize the import `import '@mantine/core/styles.css'`.
declare module "@mantine/core/styles.css" {
  const css: { [key: string]: string } | string
  export default css
}
