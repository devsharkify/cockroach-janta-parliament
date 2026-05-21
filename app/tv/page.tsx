import type { Metadata } from 'next'
import { getRotatedArticles } from '@/lib/newsArticles'
import TVContent from './TVContent'

export const revalidate = 1800 // regenerate every 30 min → rotates article order

export const metadata: Metadata = {
  title: 'Cockroach Janta TV — Breaking Drain News',
  description: 'India\'s only cockroach-run news channel. All the corruption, drama, and drain politics you didn\'t know you needed.',
}

export default function TVPage() {
  const articles = getRotatedArticles()
  return <TVContent articles={articles} />
}
