import type { Metadata } from 'next'
import { FOUNDING_PARTIES } from '@/lib/types'
import type { PartyDetailResponse } from '@/app/api/parties/[code]/route'
import PartyContent from './PartyContent'

const VALID_CODES = FOUNDING_PARTIES.map((p) => p.code) as string[]

type Props = {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  const upperCode = code.toUpperCase()
  const found = FOUNDING_PARTIES.find((p) => p.code === upperCode)
  return {
    title: found
      ? `${found.name} — Cockroach Janta Parliament`
      : 'Party — Cockroach Janta Parliament',
  }
}

async function getPartyDetail(code: string): Promise<PartyDetailResponse | null> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    const res = await fetch(`${base}/api/parties/${code}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function PartyPage({ params }: Props) {
  const { code } = await params
  const upperCode = code.toUpperCase()

  if (!VALID_CODES.includes(upperCode)) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#3C3489',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <div>
          <div style={{ fontSize: '5rem' }}>🪳</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Party Not Found</h1>
          <p style={{ opacity: 0.6 }}>That party doesn&apos;t exist. Yet.</p>
          <a
            href="/parties"
            style={{ color: '#D4A017', textDecoration: 'underline', marginTop: '1rem', display: 'block' }}
          >
            ← Back to all parties
          </a>
        </div>
      </div>
    )
  }

  const data = await getPartyDetail(upperCode)

  if (!data) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#3C3489',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <div>
          <div style={{ fontSize: '5rem' }}>🪳</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Something broke</h1>
          <a
            href="/parties"
            style={{ color: '#D4A017', textDecoration: 'underline', marginTop: '1rem', display: 'block' }}
          >
            ← Back to all parties
          </a>
        </div>
      </div>
    )
  }

  return (
    <PartyContent
      party={data.party}
      topCandidates={data.topCandidates}
      totalCandidates={data.totalCandidates}
      totalVotes={data.totalVotes}
    />
  )
}
