const PUBLIC_PATHS = ['/', '/form'] as const

export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const base = String(siteUrl ?? '').trim().replace(/\/$/, '')

  if (!base) {
    setResponseStatus(event, 404)
    return ''
  }

  const urls = PUBLIC_PATHS.map((path) => {
    const loc = path === '/' ? base : `${base}${path}`
    return `  <url><loc>${loc}</loc></url>`
  }).join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
})