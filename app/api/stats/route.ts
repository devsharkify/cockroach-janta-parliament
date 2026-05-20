import { candidates, votes, souls, cycles } from '@/lib/mongodb/collections'

export async function GET() {
  const headers = { 'Cache-Control': 'max-age=30' }

  if (!process.env.MONGODB_URI) {
    return Response.json(
      {
        totalCandidates: 12847,
        totalVotes: 394201,
        totalSeats: 543,
        activeCycle: true,
        nextSnapshot: new Date('2026-06-07T17:30:00Z').toISOString(),
        totalSouls: 8934,
      },
      { headers }
    )
  }

  const [candidatesCol, votesCol, soulsCol, cyclesCol] = await Promise.all([
    candidates(),
    votes(),
    souls(),
    cycles(),
  ])

  const [totalCandidates, totalVotes, totalSouls, liveCycle] = await Promise.all([
    candidatesCol.countDocuments({ withdrawn: false }),
    votesCol.countDocuments({}),
    soulsCol.countDocuments({}),
    cyclesCol.findOne({ status: 'live' }, { sort: { cycle_number: -1 } }),
  ])

  return Response.json(
    {
      totalCandidates,
      totalVotes,
      totalSeats: 543,
      activeCycle: liveCycle !== null,
      nextSnapshot: liveCycle ? liveCycle.snapshot_at.toISOString() : null,
      totalSouls,
    },
    { headers }
  )
}
