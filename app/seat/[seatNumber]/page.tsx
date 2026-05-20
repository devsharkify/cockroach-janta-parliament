import type { Metadata } from 'next'
import SeatContent from './SeatContent'

export async function generateMetadata({ params }: { params: Promise<{ seatNumber: string }> }): Promise<Metadata> {
  const { seatNumber } = await params
  const num = parseInt(seatNumber, 10)
  if (isNaN(num) || num < 1 || num > 543) {
    return { title: 'Invalid Seat' }
  }

  // Try to fetch seat name (graceful fallback)
  let seatName = `Constituency ${num}`
  let stateName = 'India'
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'
    const res = await fetch(`${base}/api/seats/${num}`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const data = await res.json()
      seatName = data.seat?.name ?? seatName
      stateName = data.seat?.state ?? stateName
    }
  } catch { /* fallback */ }

  const title = `${seatName} — Seat #${num}`
  const description = `Vote for your favourite cockroach candidate in ${seatName}, ${stateName}. Unlimited votes. Pure chaos.`

  return {
    title,
    description,
    openGraph: {
      title: `🪳 ${seatName} (#${num}) — Cockroach Janta Parliament`,
      description,
      type: 'website',
    },
    twitter: { card: 'summary', title: `🪳 ${seatName} (#${num})`, description },
  }
}

export default async function SeatPage({ params }: { params: Promise<{ seatNumber: string }> }) {
  const { seatNumber } = await params
  const num = parseInt(seatNumber, 10)

  if (isNaN(num) || num < 1 || num > 543) {
    return (
      <div style={{ minHeight: '100vh', background: '#3C3489', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textAlign: 'center', padding: '2rem' }}>
        <div>
          <div style={{ fontSize: '5rem' }}>🪳</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Invalid Seat</h1>
          <p style={{ opacity: 0.6 }}>Seat numbers run from 1 to 543.</p>
          <a href="/" style={{ color: '#D4A017', textDecoration: 'underline', marginTop: '1rem', display: 'block' }}>← Back to Parliament</a>
        </div>
      </div>
    )
  }

  return <SeatContent seatNumber={num} />
}
