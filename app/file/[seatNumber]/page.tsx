import type { Metadata } from 'next'
import FilingFlow from './FilingFlow'

export async function generateMetadata({ params }: { params: Promise<{ seatNumber: string }> }): Promise<Metadata> {
  const { seatNumber } = await params
  return {
    title: `File Candidacy — Seat #${seatNumber}`,
    description: `Contest Lok Sabha Seat #${seatNumber} as a cockroach. Auto-generated identity. Free. Anonymous. Chaotic.`,
    openGraph: { title: `🪳 File for Seat #${seatNumber} — CJP`, description: 'Become a cockroach MP. It\'s free. It\'s chaos.' },
  }
}

export default async function FilePage({
  params,
}: {
  params: Promise<{ seatNumber: string }>
}) {
  const { seatNumber } = await params
  const num = parseInt(seatNumber, 10)

  if (isNaN(num) || num < 1 || num > 543) {
    return (
      <div className="min-h-screen bg-[#3C3489] flex items-center justify-center text-white text-center p-8">
        <div>
          <div className="text-8xl mb-4">🪳</div>
          <h1 className="text-3xl font-black mb-2">Invalid Seat</h1>
          <p className="text-white/60">Seat numbers run from 1 to 543.</p>
        </div>
      </div>
    )
  }

  return <FilingFlow seatNumber={num} />
}
