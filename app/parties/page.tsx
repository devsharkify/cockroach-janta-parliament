import type { Metadata } from 'next'
import type { PartyData } from '@/app/api/parties/route'
import PartiesContent from './PartiesContent'

export const metadata: Metadata = {
  title: 'Parties — Cockroach Janta Parliament',
}

async function getParties(): Promise<PartyData[]> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    const res = await fetch(`${base}/api/parties`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function PartiesPage() {
  const parties = await getParties()
  return <PartiesContent parties={parties} />
}
