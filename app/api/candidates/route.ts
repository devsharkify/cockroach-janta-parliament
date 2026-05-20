import { NextRequest } from 'next/server'
import { candidates, souls, seats } from '@/lib/mongodb/collections'

// POST /api/candidates
// Body: { seatNumber, displayName, manifesto, partyId, isIndependent, fingerprint }
// Returns: { id, displayName, seatNumber } | { error }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return Response.json({ error: 'Invalid body' }, { status: 400 })

  const { seatNumber, displayName, manifesto, partyId, isIndependent, fingerprint } = body

  if (!seatNumber || !displayName || !manifesto || !fingerprint) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (manifesto.length > 280) {
    return Response.json({ error: 'Manifesto too long (280 char max)' }, { status: 400 })
  }

  // Without MongoDB env vars, return a mock success for local development
  if (!process.env.MONGODB_URI) {
    return Response.json({ id: crypto.randomUUID(), displayName, seatNumber, _mock: true })
  }

  // Soft cap: 5 candidacies per fingerprint in the last 7 days
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const col = await candidates()
  const recentCount = await col.countDocuments({
    filer_fingerprint: fingerprint,
    created_at: { $gte: weekAgo },
  })

  if (recentCount >= 5) {
    return Response.json({ error: 'Something went wrong. Please try again later.' }, { status: 429 })
  }

  // Verify seat exists
  const seatsCol = await seats()
  const seat = await seatsCol.findOne({ number: Number(seatNumber) })

  if (!seat) return Response.json({ error: 'Invalid seat' }, { status: 400 })

  // Insert candidate
  const now = new Date()
  const id = crypto.randomUUID()
  await col.insertOne({
    id,
    seat_number: Number(seatNumber),
    display_name: String(displayName),
    manifesto: String(manifesto).slice(0, 280),
    party_id: isIndependent ? null : (partyId ?? null),
    is_independent: Boolean(isIndependent ?? !partyId),
    filer_fingerprint: String(fingerprint),
    ig_handle: null,
    ig_shared: false,
    withdrawn: false,
    created_at: now,
  })

  // Upsert soul and grant +10 XP for filing (best-effort)
  try {
    const soulsCol = await souls()
    await soulsCol.updateOne(
      { fingerprint: String(fingerprint) },
      {
        $inc: { xp: 10, total_candidacies: 1 },
        $setOnInsert: {
          fingerprint: String(fingerprint),
          level: 1,
          streak_days: 0,
          last_visit_date: null,
          total_votes: 0,
          total_nominations: 0,
          achievements: {},
          created_at: new Date(),
        },
      },
      { upsert: true }
    )
  } catch { /* non-critical */ }

  return Response.json({
    id,
    displayName,
    seatNumber: Number(seatNumber),
  })
}
