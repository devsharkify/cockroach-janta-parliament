import { seats, parties, cycles } from '@/lib/mongodb/collections'

export async function GET() {
  const checks: Record<string, string | number | boolean> = {
    ok: false,
    seats: 0,
    parties: 0,
    cycles: 0,
    live_cycle: false,
  }

  if (!process.env.MONGODB_URI) {
    checks.error = 'MONGODB_URI not configured'
    return Response.json(checks, { status: 503 })
  }

  try {
    const [seatsCount, partiesCount, liveCycle] = await Promise.all([
      (await seats()).countDocuments(),
      (await parties()).countDocuments(),
      (await cycles()).findOne({ status: 'live' }, { projection: { cycle_number: 1 } }),
    ])

    checks.seats = seatsCount
    checks.parties = partiesCount
    checks.live_cycle = liveCycle !== null
    checks.cycles = liveCycle ? liveCycle.cycle_number : 0
    checks.ok = seatsCount >= 543 && partiesCount >= 4 && liveCycle !== null
  } catch (err) {
    checks.error = err instanceof Error ? err.message : 'Unknown error'
  }

  return Response.json(checks, { status: checks.ok ? 200 : 503 })
}
