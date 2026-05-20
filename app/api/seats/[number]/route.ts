import { NextRequest } from 'next/server'
import { seats, candidates, votes, cycles, parties } from '@/lib/mongodb/collections'

type SeatResponse = {
  seat: { number: number; name: string; state: string; stateCode: string; slug: string }
  candidates: Array<{
    id: string
    displayName: string
    partyCode: string | null
    partyColor: string | null
    partyName: string | null
    isIndependent: boolean
    manifesto: string
    voteCount: number
    createdAt: string
  }>
  totalVotes: number
  cycleId: string | null
}

// GET /api/seats/[number]
// Returns seat details + candidates for the seat page
export async function GET(req: NextRequest, ctx: { params: Promise<{ number: string }> }) {
  const { number } = await ctx.params

  const num = parseInt(number, 10)
  if (isNaN(num) || num < 1 || num > 543) {
    return Response.json({ error: 'Seat not found' }, { status: 404 })
  }

  const headers = { 'Cache-Control': 'no-store' }

  // Return mock data when MongoDB is not configured
  if (!process.env.MONGODB_URI) {
    const mock: SeatResponse = {
      seat: {
        number: num,
        name: `Constituency ${num}`,
        state: 'Demo State',
        stateCode: 'DS',
        slug: `constituency-${num}`,
      },
      candidates: [
        {
          id: 'mock-1',
          displayName: 'Naali_Naresh_42',
          partyCode: 'CJP',
          partyColor: '#7F77DD',
          partyName: 'Cockroach Janta Party',
          isIndependent: false,
          manifesto: "Free naali for all. Brooms banned. Vote or don't, I survive either way.",
          voteCount: 342,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'mock-2',
          displayName: 'Kachra_Queen',
          partyCode: 'ACP',
          partyColor: '#1D9E75',
          partyName: 'Aam Cockroach Party',
          isIndependent: false,
          manifesto: 'Naali sabki iss baar cockroach ki. Your garbage is my palace.',
          voteCount: 289,
          createdAt: new Date(Date.now() - 72000000).toISOString(),
        },
        {
          id: 'mock-3',
          displayName: 'Gobar_Sarkar',
          partyCode: null,
          partyColor: null,
          partyName: null,
          isIndependent: true,
          manifesto: 'No party. No agenda. Just vibes and survival instinct.',
          voteCount: 156,
          createdAt: new Date(Date.now() - 43200000).toISOString(),
        },
      ],
      totalVotes: 787,
      cycleId: null,
    }
    return Response.json(mock, { headers })
  }

  // Fetch the seat
  const seatDoc = await (await seats()).findOne({ number: num })
  if (!seatDoc) {
    return Response.json({ error: 'Seat not found' }, { status: 404, headers })
  }

  // Fetch non-withdrawn candidates for this seat
  const candidateDocs = await (await candidates()).find({ seat_number: num, withdrawn: false }).toArray()

  // Fetch current live cycle
  const cycleDoc = await (await cycles()).findOne({ status: 'live' }, { projection: { id: 1 } })
  const cycleId = cycleDoc?.id ?? null

  // Count votes per candidate using aggregation
  const voteCounts: Record<string, number> = {}
  if (candidateDocs.length > 0) {
    const candidateIds = candidateDocs.map(c => c.id)
    const votesCol = await votes()
    const pipeline = [
      { $match: { candidate_id: { $in: candidateIds }, seat_number: num, ...(cycleId ? { cycle_id: cycleId } : {}) } },
      { $group: { _id: '$candidate_id', count: { $sum: 1 } } },
    ]
    const agg = await votesCol.aggregate<{ _id: string; count: number }>(pipeline).toArray()
    for (const row of agg) voteCounts[row._id] = row.count
  }

  // Look up party info
  const partyIds = [...new Set(candidateDocs.map(c => c.party_id).filter(Boolean))] as string[]
  const partyMap: Record<string, { code: string; color: string; name: string }> = {}
  if (partyIds.length > 0) {
    const partiesCol = await parties()
    const partyDocs = await partiesCol.find({ id: { $in: partyIds } }).toArray()
    for (const p of partyDocs) partyMap[p.id] = { code: p.code, color: p.color, name: p.name }
  }

  // Build response candidates
  const responseCandidates: SeatResponse['candidates'] = candidateDocs.map(c => {
    const party = c.party_id ? partyMap[c.party_id] ?? null : null
    const voteCount = voteCounts[c.id] ?? 0
    return {
      id: c.id,
      displayName: c.display_name,
      partyCode: party?.code ?? null,
      partyColor: party?.color ?? null,
      partyName: party?.name ?? null,
      isIndependent: c.is_independent,
      manifesto: c.manifesto,
      voteCount,
      createdAt: c.created_at instanceof Date ? c.created_at.toISOString() : String(c.created_at),
    }
  })

  const totalVotes = responseCandidates.reduce((sum, c) => sum + c.voteCount, 0)

  const response: SeatResponse = {
    seat: {
      number: seatDoc.number,
      name: seatDoc.name,
      state: seatDoc.state,
      stateCode: seatDoc.state_code,
      slug: seatDoc.slug,
    },
    candidates: responseCandidates,
    totalVotes,
    cycleId,
  }

  return Response.json(response, { headers })
}
