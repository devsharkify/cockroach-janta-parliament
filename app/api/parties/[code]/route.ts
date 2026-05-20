import { NextRequest } from 'next/server'
import { parties, candidates, votes } from '@/lib/mongodb/collections'
import { FOUNDING_PARTIES } from '@/lib/types'

export type TopCandidate = {
  id: string
  displayName: string
  seatNumber: number
  manifesto: string
  voteCount: number
  createdAt: string
}

export type PartyDetailResponse = {
  party: {
    id: string
    code: string
    name: string
    color: string
    tagline: string
    is_founding: boolean
  }
  topCandidates: TopCandidate[]
  totalCandidates: number
  totalVotes: number
}

const VALID_CODES = FOUNDING_PARTIES.map((p) => p.code)

// Mock candidates keyed by party code
const MOCK_CANDIDATES: Record<string, TopCandidate[]> = {
  CJP: [
    { id: 'mock-cjp-1', displayName: 'Naali_Naresh_42', seatNumber: 1, manifesto: 'Free naali for all. Brooms banned. Vote or survive.', voteCount: 8420, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 'mock-cjp-2', displayName: 'Sarkari_Roach', seatNumber: 7, manifesto: 'I have been in the system since 1947. Vote me.', voteCount: 6210, createdAt: new Date(Date.now() - 172800000).toISOString() },
    { id: 'mock-cjp-3', displayName: 'CJP_Supremo_99', seatNumber: 42, manifesto: 'Lazy yes. Unbeatable also yes.', voteCount: 5034, createdAt: new Date(Date.now() - 259200000).toISOString() },
    { id: 'mock-cjp-4', displayName: 'Whisker_Wali', seatNumber: 100, manifesto: 'The establishment roach you actually like.', voteCount: 3811, createdAt: new Date(Date.now() - 345600000).toISOString() },
    { id: 'mock-cjp-5', displayName: 'Drain_Dharma', seatNumber: 200, manifesto: 'Every drain is sacred. Especially mine.', voteCount: 2200, createdAt: new Date(Date.now() - 432000000).toISOString() },
  ],
  ACP: [
    { id: 'mock-acp-1', displayName: 'Kachra_Queen', seatNumber: 3, manifesto: 'Naali sabki iss baar cockroach ki. Your garbage is my palace.', voteCount: 7750, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 'mock-acp-2', displayName: 'Aam_Aadmi_Roach', seatNumber: 18, manifesto: 'We are the people. We are the pest.', voteCount: 5500, createdAt: new Date(Date.now() - 172800000).toISOString() },
    { id: 'mock-acp-3', displayName: 'Gutter_Gandhi', seatNumber: 55, manifesto: 'I walk where others refuse to look.', voteCount: 4100, createdAt: new Date(Date.now() - 259200000).toISOString() },
    { id: 'mock-acp-4', displayName: 'Naali_Neta', seatNumber: 88, manifesto: "From the gutter to the parliament. The people's roach.", voteCount: 3200, createdAt: new Date(Date.now() - 345600000).toISOString() },
    { id: 'mock-acp-5', displayName: 'Sewer_Sevak', seatNumber: 123, manifesto: 'Serving the naali since before you were born.', voteCount: 1900, createdAt: new Date(Date.now() - 432000000).toISOString() },
  ],
  CCP: [
    { id: 'mock-ccp-1', displayName: 'Purana_Roach', seatNumber: 5, manifesto: 'We invented the drain. Respect the legacy.', voteCount: 6800, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 'mock-ccp-2', displayName: 'Congress_Cockroach', seatNumber: 22, manifesto: 'Old roach. New tricks. Same old drain.', voteCount: 4900, createdAt: new Date(Date.now() - 172800000).toISOString() },
    { id: 'mock-ccp-3', displayName: 'Virasat_Vali', seatNumber: 77, manifesto: 'My family has held this drain for three generations.', voteCount: 3600, createdAt: new Date(Date.now() - 259200000).toISOString() },
    { id: 'mock-ccp-4', displayName: 'Itihas_Insect', seatNumber: 150, manifesto: 'History is on our side. So is the smell.', voteCount: 2400, createdAt: new Date(Date.now() - 345600000).toISOString() },
    { id: 'mock-ccp-5', displayName: 'Legacy_Larva', seatNumber: 300, manifesto: "Born into this. You can't replace tradition.", voteCount: 1200, createdAt: new Date(Date.now() - 432000000).toISOString() },
  ],
  RCP: [
    { id: 'mock-rcp-1', displayName: 'Galli_Ka_Gupta', seatNumber: 9, manifesto: 'My galli. My rules. My kachra.', voteCount: 5200, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 'mock-rcp-2', displayName: 'Local_Loafer_Roach', seatNumber: 31, manifesto: 'I only contest where my roaches live. Hyper-local.', voteCount: 3900, createdAt: new Date(Date.now() - 172800000).toISOString() },
    { id: 'mock-rcp-3', displayName: 'Mohalla_Mantri', seatNumber: 67, manifesto: 'Every mohalla deserves a roach representative.', voteCount: 2800, createdAt: new Date(Date.now() - 259200000).toISOString() },
    { id: 'mock-rcp-4', displayName: 'Regional_Raja', seatNumber: 200, manifesto: "We don't do national. National is overrated.", voteCount: 1700, createdAt: new Date(Date.now() - 345600000).toISOString() },
    { id: 'mock-rcp-5', displayName: 'Kachra_Ka_King', seatNumber: 400, manifesto: "Apni galli apna kachra. Don't touch our trash.", voteCount: 900, createdAt: new Date(Date.now() - 432000000).toISOString() },
  ],
}

// GET /api/parties/[code] — party detail + top 10 candidates
export async function GET(req: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params
  const upperCode = code.toUpperCase()
  const headers = { 'Cache-Control': 'no-store' }

  if (!VALID_CODES.includes(upperCode as typeof VALID_CODES[number])) {
    return Response.json({ error: 'Party not found' }, { status: 404, headers })
  }

  const foundingParty = FOUNDING_PARTIES.find((p) => p.code === upperCode)!

  // Mock path
  if (!process.env.MONGODB_URI) {
    const mockCandidates = MOCK_CANDIDATES[upperCode] ?? []
    const totalVotes = mockCandidates.reduce((sum, c) => sum + c.voteCount, 0)
    const res: PartyDetailResponse = {
      party: {
        id: `mock-${upperCode.toLowerCase()}`,
        code: upperCode,
        name: foundingParty.name,
        color: foundingParty.color,
        tagline: foundingParty.tagline,
        is_founding: true,
      },
      topCandidates: mockCandidates,
      totalCandidates: mockCandidates.length,
      totalVotes,
    }
    return Response.json(res, { headers })
  }

  // MongoDB path
  const partiesCol = await parties()
  const partyDoc = await partiesCol.findOne({ code: upperCode })

  if (!partyDoc) {
    return Response.json({ error: 'Party not found' }, { status: 404, headers })
  }

  const candidatesCol = await candidates()
  const votesCol = await votes()

  const totalCandidates = await candidatesCol.countDocuments({ party_id: partyDoc.id, withdrawn: false })

  // Top candidates by vote count via aggregation
  const topAgg = await votesCol.aggregate<{ _id: string; count: number }>([
    {
      $lookup: {
        from: 'candidates',
        localField: 'candidate_id',
        foreignField: 'id',
        as: 'candidate',
      },
    },
    { $unwind: '$candidate' },
    { $match: { 'candidate.party_id': partyDoc.id, 'candidate.withdrawn': false } },
    { $group: { _id: '$candidate_id', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]).toArray()

  const topCandidateIds = topAgg.map((r) => r._id)
  const voteMap: Record<string, number> = {}
  for (const r of topAgg) voteMap[r._id] = r.count

  const topCandidateDocs = topCandidateIds.length > 0
    ? await candidatesCol.find({ id: { $in: topCandidateIds } }).toArray()
    : []

  const topCandidates: TopCandidate[] = topCandidateDocs
    .map((c) => ({
      id: c.id,
      displayName: c.display_name,
      seatNumber: c.seat_number,
      manifesto: c.manifesto,
      voteCount: voteMap[c.id] ?? 0,
      createdAt: c.created_at instanceof Date ? c.created_at.toISOString() : String(c.created_at),
    }))
    .sort((a, b) => b.voteCount - a.voteCount)

  const totalVotes = topAgg.reduce((sum, r) => sum + r.count, 0)

  const res: PartyDetailResponse = {
    party: {
      id: partyDoc.id,
      code: partyDoc.code,
      name: partyDoc.name,
      color: partyDoc.color,
      tagline: partyDoc.tagline ?? '',
      is_founding: partyDoc.is_founding,
    },
    topCandidates,
    totalCandidates,
    totalVotes,
  }

  return Response.json(res, { headers })
}
