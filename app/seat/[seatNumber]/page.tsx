import type { Metadata } from 'next'
import SeatContent from './SeatContent'

export async function generateMetadata({ params }: { params: Promise<{ seatNumber: string }> }): Promise<Metadata> {
  const { seatNumber } = await params
  return { title: `Seat ${seatNumber} — Cockroach Janta Parliament` }
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
