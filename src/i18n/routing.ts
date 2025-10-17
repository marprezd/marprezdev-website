import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "es", "tr", "fr"],

  // Used when no locale matches
  defaultLocale: "en",
  pathnames: {
    "/": "/",
    "/blog": {
      en: "/blog",
      es: "/blog",
      tr: "/blog",
      fr: "/blog",
    },
    "/blog/[slug]": {
      en: "/blog/[slug]",
      es: "/blog/[slug]",
      tr: "/blog/[slug]",
      fr: "/blog/[slug]",
    },
    "/tags": {
      en: "/tags",
      es: "/etiquetas",
      tr: "/etiketler",
      fr: "/etiquettes",
    },
    "/tags/[tag]": {
      en: "/tags/[tag]",
      es: "/etiquetas/[tag]",
      tr: "/etiketler/[tag]",
      fr: "/etiquettes/[tag]",
    },
    "/categories": {
      en: "/categories",
      es: "/categorias",
      tr: "/kategoriler",
      fr: "/categories",
    },
    "/categories/[category]": {
      en: "/categories/[category]",
      es: "/categorias/[category]",
      tr: "/kategoriler/[category]",
      fr: "/categories/[category]",
    },
    "/repositories": {
      en: "/repositories",
      es: "/repositorios",
      tr: "/depoları",
      fr: "/depots",
    },
    "/works": {
      en: "/works",
      es: "/trabajos",
      tr: "/isler",
      fr: "/travaux",
    },
    "/courses": {
      en: "/courses",
      es: "/cursos",
      tr: "/dersler",
      fr: "/cours",
    },
    "/hire-me": {
      en: "/hire-me",
      es: "/contratame",
      tr: "/beni-ise-al",
      fr: "/embauchez-moi",
    },
    "/guestbook": {
      en: "/guestbook",
      es: "/libro-de-visitas",
      tr: "/misafirlik-kitabi",
      fr: "/livre-de-visites",
    },
    "/resources": {
      en: "/resources",
      es: "/recursos",
      tr: "/kaynaklar",
      fr: "/ressources",
    },
    "[...rest]": "[...rest]",
  },
})
