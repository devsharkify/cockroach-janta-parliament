import type { NextRequest } from 'next/server'
import { cycles, votes } from '@/lib/mongodb/collections'
import clientPromise from '@/lib/mongodb/client'

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.MONGODB_URI) {
    return Response.json({ error: 'No database configured' }, { status: 503 })
  }

  try {
    const cyclesCol = await cycles()
    const liveCycle = await cyclesCol.findOne({ status: 'live' })
    if (!liveCycle) return Response.json({ error: 'No live cycle found' }, { status: 404 })

    // Aggregate winners per seat
    const votesCol = await votes()
    const winners = await votesCol.aggregate([
      { $match: { cycle_id: liveCycle.id } },
      { $group: { _id: { seat_number: '$seat_number', candidate_id: '$candidate_id' }, count: { $sum: 1 } } },
      { $sort: { '_id.seat_number': 1, count: -1 } },
      { $group: { _id: '$_id.seat_number', winner_candidate_id: { $first: '$_id.candidate_id' }, total_votes: { $first: '$count' } } },
    ]).toArray()

    // Store results (upsert per cycle+seat)
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB ?? 'cockroach_parliament')
    const resultsCol = db.collection('results')

    const resultOps = winners.map((w: any) => ({
      updateOne: {
        filter: { cycle_id: liveCycle.id, seat_number: w._id },
        update: {
          $set: {
            cycle_id: liveCycle.id,
            seat_number: w._id,
            winner_candidate_id: w.winner_candidate_id,
            total_votes: w.total_votes,
            created_at: new Date(),
          },
        },
        upsert: true,
      },
    }))
    if (resultOps.length > 0) await resultsCol.bulkWrite(resultOps)

    // Close current cycle
    await cyclesCol.updateOne({ id: liveCycle.id }, { $set: { status: 'closed' } })

    // Create next cycle (next Sunday 11PM IST = 17:30 UTC)
    const nextSun = new Date()
    const daysUntilSun = (7 - nextSun.getDay()) % 7 || 7
    nextSun.setDate(nextSun.getDate() + daysUntilSun)
    nextSun.setUTCHours(17, 30, 0, 0)
    const nextSat = nextSun

    const nextCycle = {
      id: crypto.randomUUID(),
      cycle_number: liveCycle.cycle_number + 1,
      starts_at: new Date(),
      snapshot_at: nextSat,
      ends_at: new Date(nextSat.getTime() + 60 * 60 * 1000),
      status: 'live' as const,
      created_at: new Date(),
    }
    await cyclesCol.insertOne(nextCycle)

    return Response.json({
      success: true,
      cycleClosedId: liveCycle.id,
      cycleNumber: liveCycle.cycle_number,
      winnersComputed: winners.length,
      nextCycleId: nextCycle.id,
    })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Snapshot failed' },
      { status: 500 }
    )
  }
}
