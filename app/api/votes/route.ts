import { NextRequest } from 'next/server'
import { votes, souls, cycles } from '@/lib/mongodb/collections'

export async function POST(request: NextRequest) {
  let body: { candidateId?: unknown; seatNumber?: unknown; fingerprint?: unknown; cycleId?: unknown }

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { candidateId, seatNumber, fingerprint } = body

  // Validate required fields
  if (!candidateId || typeof candidateId !== 'string') {
    return Response.json({ error: 'candidateId is required and must be a string' }, { status: 400 })
  }
  if (seatNumber === undefined || seatNumber === null || typeof seatNumber !== 'number' || !Number.isInteger(seatNumber) || seatNumber < 1 || seatNumber > 543) {
    return Response.json({ error: 'seatNumber is required and must be an integer between 1 and 543' }, { status: 400 })
  }
  if (!fingerprint || typeof fingerprint !== 'string') {
    return Response.json({ error: 'fingerprint is required and must be a string' }, { status: 400 })
  }

  // Mock mode when MongoDB is not configured
  if (!process.env.MONGODB_URI) {
    return Response.json({
      success: true,
      voteCount: Math.floor(Math.random() * 1000) + 1,
      _mock: true,
    })
  }

  // Step a: Get current live cycle
  const cyclesCol = await cycles()
  const liveCycle = await cyclesCol.findOne({ status: 'live' }, { projection: { id: 1 } })
  const resolvedCycleId: string | null = liveCycle ? liveCycle.id : null

  // Step b: Check if already voted (informational — unlimited voting allowed)
  const votesCol = await votes()
  const existingVote = await votesCol.findOne({
    voter_fingerprint: fingerprint,
    seat_number: Number(seatNumber),
    ...(resolvedCycleId ? { cycle_id: resolvedCycleId } : {}),
  })
  const alreadyVoted = existingVote !== null

  // Step c: Insert vote regardless (unlimited voting allowed)
  await votesCol.insertOne({
    cycle_id: resolvedCycleId ?? null,
    candidate_id: String(candidateId),
    seat_number: Number(seatNumber),
    voter_fingerprint: String(fingerprint),
    ip_hash: null,
    ua_hash: null,
    created_at: new Date(),
  })

  // Step d: Count votes for this candidate
  const voteCount = await votesCol.countDocuments({ candidate_id: String(candidateId) })

  // Step e: Best-effort upsert soul with +1 XP
  try {
    const soulsCol = await souls()
    await soulsCol.updateOne(
      { fingerprint: String(fingerprint) },
      {
        $inc: { xp: 1, total_votes: 1 },
        $setOnInsert: {
          fingerprint,
          level: 1,
          streak_days: 0,
          last_visit_date: null,
          total_candidacies: 0,
          total_nominations: 0,
          achievements: {},
          created_at: new Date(),
        },
      },
      { upsert: true }
    )
  } catch { /* non-critical */ }

  // Step f: Return result
  return Response.json({
    success: true,
    voteCount,
    alreadyVoted,
  })
}
