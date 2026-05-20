import type { Metadata } from 'next'
import SupremeContent from './SupremeContent'

export const metadata: Metadata = {
  title: 'Supreme Commander — Cockroach Janta Parliament',
  description: 'Samrat Macchar rules all 543 seats.',
}

export default function SupremePage() {
  return <SupremeContent />
}
