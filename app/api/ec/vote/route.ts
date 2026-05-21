import { NextRequest } from 'next/server'
import { ecApplications, ecVotes } from '@/lib/mongodb/collections'

const MAX_VOTES = 1000

// POST /api/ec/vote
// body: { applicationId, positionId, fingerprint }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return Response.json({ error: 'Invalid body' }, { status: 400 })

  const { applicationId, positionId, fingerprint } = body

  if (!applicationId || !positionId || !fingerprint) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!process.env.MONGODB_URI) {
    return Response.json({ ok: true, votesUsed: 1, votesRemaining: MAX_VOTES - 1, _mock: true })
  }

  const votesCol = await ecVotes()

  // Count total votes this fingerprint has cast across ALL EC positions
  const totalVotesUsed = await votesCol.countDocuments({ voter_fingerprint: String(fingerprint) })

  if (totalVotesUsed >= MAX_VOTES) {
    return Response.json(
      { error: 'You have used all 1000 EC votes', votesUsed: totalVotesUsed, votesRemaining: 0 },
      { status: 429 }
    )
  }

  // Insert the vote
  const id = crypto.randomUUID()
  await votesCol.insertOne({
    id,
    application_id: String(applicationId),
    position_id: String(positionId),
    voter_fingerprint: String(fingerprint),
    created_at: new Date(),
  })

  // Update denormalized vote_count on the application
  const appsCol = await ecApplications()
  await appsCol.updateOne(
    { id: String(applicationId) },
    { $inc: { vote_count: 1 } }
  )

  const newTotal = totalVotesUsed + 1
  return Response.json({
    ok: true,
    votesUsed: newTotal,
    votesRemaining: MAX_VOTES - newTotal,
  })
}
