import { parties, candidates, votes, souls } from '@/lib/mongodb/collections'

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

// POST /api/parties — create a new party
export async function POST(req: Request) {
  const headers = { 'Cache-Control': 'no-store' }

  let body: { code?: unknown; name?: unknown; color?: unknown; tagline?: unknown; fingerprint?: unknown; symbol?: unknown }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400, headers })
  }

  const { code, name, color, tagline, fingerprint, symbol } = body

  // Validate
  if (typeof code !== 'string' || !/^[A-Z0-9]{2,6}$/.test(code.toUpperCase())) {
    return Response.json({ error: 'Party code must be 2–6 uppercase letters/numbers' }, { status: 400, headers })
  }
  if (typeof name !== 'string' || name.trim().length < 5 || name.trim().length > 60) {
    return Response.json({ error: 'Party name must be 5–60 characters' }, { status: 400, headers })
  }
  if (typeof color !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(color)) {
    return Response.json({ error: 'Color must be a valid hex color (e.g. #FF5722)' }, { status: 400, headers })
  }
  if (tagline !== undefined && (typeof tagline !== 'string' || tagline.length > 60)) {
    return Response.json({ error: 'Tagline must be at most 60 characters' }, { status: 400, headers })
  }
  if (symbol !== undefined && (typeof symbol !== 'string' || symbol.length === 0 || symbol.length > 6)) {
    return Response.json({ error: 'Symbol must be 1–6 characters' }, { status: 400, headers })
  }
  if (typeof fingerprint !== 'string' || fingerprint.trim().length === 0) {
    return Response.json({ error: 'fingerprint is required' }, { status: 400, headers })
  }

  const normalizedCode = (code as string).toUpperCase()

  // Mock path
  if (!process.env.MONGODB_URI) {
    const mockParty = {
      id: crypto.randomUUID(),
      code: normalizedCode,
      name: (name as string).trim(),
      color,
      tagline: typeof tagline === 'string' ? tagline.trim() : '',
      symbol: typeof symbol === 'string' ? symbol : '🪳',
      is_founding: false,
    }
    return Response.json({ party: mockParty }, { status: 201, headers })
  }

  const partiesCol = await parties()

  // Check code uniqueness
  const existing = await partiesCol.findOne({ code: normalizedCode })
  if (existing) {
    return Response.json({ error: `Party code "${normalizedCode}" is already taken` }, { status: 409, headers })
  }

  // Global cap: max 30 user-created (non-founding) parties
  const totalNewParties = await partiesCol.countDocuments({ is_founding: false })
  if (totalNewParties >= 30) {
    return Response.json({ error: 'All 30 new party slots are taken. Parliament is full.' }, { status: 429, headers })
  }

  // Rate limit: max 3 parties per fingerprint
  const createdByUser = await partiesCol.countDocuments({ founder_fingerprint: fingerprint })
  if (createdByUser >= 3) {
    return Response.json({ error: 'You have already created 3 parties. Maximum limit reached.' }, { status: 429, headers })
  }

  const now = new Date()
  const partyDoc = {
    id: crypto.randomUUID(),
    code: normalizedCode,
    name: (name as string).trim(),
    color,
    tagline: typeof tagline === 'string' ? tagline.trim() : null,
    symbol: typeof symbol === 'string' ? symbol : '🪳',
    logo_url: null,
    founder_fingerprint: fingerprint,
    is_founding: false,
    created_at: now,
  }

  await partiesCol.insertOne(partyDoc)

  // Increment soul total_parties if soul exists
  try {
    const soulsCol = await souls()
    await soulsCol.updateOne(
      { fingerprint },
      { $inc: { total_candidacies: 0 } }, // touch doc to ensure it exists; no-op
      { upsert: false }
    )
  } catch {
    // non-fatal
  }

  return Response.json({ party: partyDoc }, { status: 201, headers })
}
