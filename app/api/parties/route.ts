import { parties, candidates, votes } from '@/lib/mongodb/collections'

export type PartyData = {
  id: string
  code: string
  name: string
  color: string
  tagline: string
  candidateCount: number
  totalVotes: number
  is_founding: boolean
}

// GET /api/parties — returns all parties with candidate + vote counts
export async function GET() {
  const headers = { 'Cache-Control': 'no-store' }

  // Mock when no MONGODB_URI
  if (!process.env.MONGODB_URI) {
    return Response.json([
      { id: 'mock-cjp', code: 'CJP', name: 'Cockroach Janta Party', color: '#7F77DD', tagline: 'Lazy, Loud, Lawful', candidateCount: 187, totalVotes: 142390, is_founding: true },
      { id: 'mock-acp', code: 'ACP', name: 'Aam Cockroach Party', color: '#1D9E75', tagline: 'Naali Sabki, Iss Baar Cockroach Ki', candidateCount: 143, totalVotes: 98234, is_founding: true },
      { id: 'mock-ccp', code: 'CCP', name: 'Cockroach Congress Party', color: '#D85A30', tagline: 'Old Roach Magic', candidateCount: 121, totalVotes: 76821, is_founding: true },
      { id: 'mock-rcp', code: 'RCP', name: 'Regional Cockroach Party', color: '#D4537E', tagline: 'Apni Galli Apna Kachra', candidateCount: 89, totalVotes: 54123, is_founding: true },
    ] satisfies PartyData[], { headers })
  }

  const partiesCol = await parties()
  const candidatesCol = await candidates()
  const votesCol = await votes()

  const partyDocs = await partiesCol.find({}).toArray()

  const results: PartyData[] = await Promise.all(
    partyDocs.map(async (p) => {
      const candidateCount = await candidatesCol.countDocuments({ party_id: p.id, withdrawn: false })

      // Sum votes for all candidates in this party
      const agg = await votesCol.aggregate<{ total: number }>([
        {
          $lookup: {
            from: 'candidates',
            localField: 'candidate_id',
            foreignField: 'id',
            as: 'candidate',
          },
        },
        { $unwind: '$candidate' },
        { $match: { 'candidate.party_id': p.id, 'candidate.withdrawn': false } },
        { $group: { _id: null, total: { $sum: 1 } } },
      ]).toArray()

      const totalVotes = agg[0]?.total ?? 0

      return {
        id: p.id,
        code: p.code,
        name: p.name,
        color: p.color,
        tagline: p.tagline ?? '',
        candidateCount,
        totalVotes,
        is_founding: p.is_founding,
      }
    })
  )

  return Response.json(results, { headers })
}
