import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cockroach Janta Parliament',
    short_name: 'CJP',
    description: 'Contest 543 Lok Sabha seats as a cockroach. Vote unlimited. Pure chaos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0b30',
    theme_color: '#D4A017',
    icons: [
      { src: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
    ],
  }
}
