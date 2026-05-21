import type { Metadata } from 'next'
import type { PartyData } from '@/app/api/parties/route'
import { ALL_PARTIES } from '@/lib/types'
import PartiesContent from './PartiesContent'

export const metadata: Metadata = {
  title: 'Parties — Cockroach Janta Parliament',
}

function mockFromAllParties(): PartyData[] {
  return ALL_PARTIES.filter(p => p.code !== 'IND').map(p => ({
    id: `mock-${p.code.toLowerCase()}`,
    code: p.code,
    name: p.name,
    color: p.color,
    tagline: p.tagline,
    candidateCount: Math.floor(Math.random() * 246) + 5,   // 5–250
    totalVotes: Math.floor(Math.random() * 49_000) + 1_000, // 1000–50000
    is_founding: p.is_founding,
  }))
}

async function getParties(): Promise<PartyData[]> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL
      ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    const res = await fetch(`${base}/api/parties`, { cache: 'no-store' })
    if (!res.ok) return mockFromAllParties()
    const data: PartyData[] = await res.json()
    if (!Array.isArray(data) || data.length === 0) return mockFromAllParties()
    return data
  } catch {
    return mockFromAllParties()
  }
}

export default async function PartiesPage() {
  const parties = await getParties()
  return <PartiesContent parties={parties} />
}
