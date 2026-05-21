import type { Metadata } from 'next'
import SupremeContent from './SupremeContent'

export const metadata: Metadata = {
  title: 'PM — Cockroach Janta Parliament',
  description: 'Pradhan Cockroach Minister rules all 543 seats.',
}

export default function SupremePage() {
  return <SupremeContent />
}
