import FilingFlow from './FilingFlow'

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
