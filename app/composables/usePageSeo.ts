import { siteSeo } from '~/constants/seo'

type PageSeoOptions = {
  title: string
  description?: string
  /** Path for canonical, e.g. `/form`. Defaults to current route. */
  path?: string
  noindex?: boolean
  /** Inject WebSite JSON-LD (homepage). */
  jsonLdWebSite?: boolean
}

function absoluteUrl(siteUrl: string, path: string) {
  const base = siteUrl.replace(/\/$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized === '/' ? '' : normalized}` || base
}

export function usePageSeo(options: PageSeoOptions) {
  const route = useRoute()
  const config = useRuntimeConfig()
  const siteUrl = String(config.public.siteUrl ?? '').trim()

  const path = options.path ?? route.path
  const description = options.description ?? siteSeo.defaultDescription
  const ogImagePath = siteSeo.ogImagePath
  const ogImage = siteUrl ? absoluteUrl(siteUrl, ogImagePath) : ogImagePath
  const canonical = siteUrl ? absoluteUrl(siteUrl, path === '/' ? '/' : path) : undefined

  useSeoMeta({
    title: options.title,
    description,
    ogTitle: options.title,
    ogDescription: description,
    ogType: 'website',
    ogSiteName: siteSeo.siteName,
    ogLocale: siteSeo.locale,
    ogImage,
    ogUrl: canonical,
    twitterCard: 'summary_large_image',
    twitterTitle: options.title,
    twitterDescription: description,
    twitterImage: ogImage,
    robots: options.noindex ? 'noindex, nofollow' : 'index, follow'
  })

  const link = canonical
    ? [{ rel: 'canonical' as const, href: canonical }]
    : []

  const script
    = options.jsonLdWebSite && siteUrl
      ? [
          {
            type: 'application/ld+json' as const,
            innerHTML: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: siteSeo.siteName,
              description: siteSeo.defaultDescription,
              url: absoluteUrl(siteUrl, '/'),
              inLanguage: 'ru-RU'
            })
          }
        ]
      : []

  useHead({
    link,
    ...(script.length ? { script } : {})
  })
}