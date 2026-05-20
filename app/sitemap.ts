import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://cockroachparliament.in'
  const now = new Date()

  // Static routes
  const staticRoutes = ['/', '/results', '/parties', '/supreme',
    '/parties/CJP', '/parties/CCP', '/parties/ACP', '/parties/RCP',
  ].map(route => ({
    url: base + route,
    lastModified: now,
    changeFrequency: 'hourly' as const,
    priority: route === '/' ? 1 : 0.8,
  }))

  // Top seats (major constituencies get SEO coverage)
  const featuredSeats = [485, 101, 173, 357, 393, 497, 467, 52, 332, 118, 84, 313, 33, 260, 149]
    .map(n => ({
      url: `${base}/seat/${n}`,
      lastModified: now,
      changeFrequency: 'hourly' as const,
      priority: 0.7,
    }))

  return [...staticRoutes, ...featuredSeats]
}
