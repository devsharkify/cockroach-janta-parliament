import type { NextRequest } from 'next/server'
import { candidates, votes, souls, cycles, parties } from '@/lib/mongodb/collections'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.MONGODB_URI) {
    return Response.json(
      {
        totalCandidates: 12847,
        activeCandidates: 11203,
        withdrawnCandidates: 1644,
        totalVotes: 394201,
        totalSouls: 8934,
        totalParties: 48,
        currentCycle: {
          cycleNumber: 3,
          status: 'live',
          snapshotAt: new Date('2026-06-07T17:30:00Z').toISOString(),
          votesThisCycle: 47823,
        },
        votesByParty: [
          { partyCode: 'INC', partyName: 'Indian National Congress', votes: 89012 },
          { partyCode: 'BJP', partyName: 'Bharatiya Janata Party', votes: 102341 },
          { partyCode: 'IND', partyName: 'Independent', votes: 72011 },
        ],
        candidatesByState: [
          { state: 'Uttar Pradesh', count: 2134 },
          { state: 'Maharashtra', count: 1876 },
          { state: 'Bihar', count: 1543 },
        ],
        xpDistribution: [
          { level: 1, souls: 5012 },
          { level: 2, souls: 2341 },
          { level: 3, souls: 891 },
          { level: 4, souls: 512 },
          { level: 5, souls: 178 },
        ],
        topSeats: [
          { seatNumber: 1, totalVotes: 4312 },
          { seatNumber: 400, totalVotes: 3987 },
          { seatNumber: 230, totalVotes: 3654 },
        ],
      },
      { status: 200 }
    )
  }

  try {
    const [candidatesCol, votesCol, soulsCol, cyclesCol, partiesCol] = await Promise.all([
      candidates(),
      votes(),
      souls(),
      cycles(),
      parties(),
    ])

    const liveCycle = await cyclesCol.findOne({ status: 'live' }, { sort: { cycle_number: -1 } })

    const [
      totalCandidates,
      activeCandidates,
      withdrawnCandidates,
      totalVotes,
      totalSouls,
      totalParties,
    ] = await Promise.all([
      candidatesCol.countDocuments({}),
      candidatesCol.countDocuments({ withdrawn: false }),
      candidatesCol.countDocuments({ withdrawn: true }),
      votesCol.countDocuments({}),
      soulsCol.countDocuments({}),
      partiesCol.countDocuments({}),
    ])

    // Votes this cycle
    const votesThisCycle = liveCycle
      ? await votesCol.countDocuments({ cycle_id: liveCycle.id })
      : 0

    // Votes per party (join via candidates)
    const votesByParty = await votesCol.aggregate([
      ...(liveCycle ? [{ $match: { cycle_id: liveCycle.id } }] : []),
      {
        $lookup: {
          from: 'candidates',
          localField: 'candidate_id',
          foreignField: 'id',
          as: 'candidate',
        },
      },
      { $unwind: { path: '$candidate', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'parties',
          localField: 'candidate.party_id',
          foreignField: 'id',
          as: 'party',
        },
      },
      { $unwind: { path: '$party', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: {
            partyCode: { $ifNull: ['$party.code', 'IND'] },
            partyName: { $ifNull: ['$party.name', 'Independent'] },
          },
          votes: { $sum: 1 },
        },
      },
      { $sort: { votes: -1 } },
      { $limit: 20 },
      {
        $project: {
          _id: 0,
          partyCode: '$_id.partyCode',
          partyName: '$_id.partyName',
          votes: 1,
        },
      },
    ]).toArray()

    // Candidates per state
    const candidatesByState = await candidatesCol.aggregate([
      { $match: { withdrawn: false } },
      {
        $lookup: {
          from: 'seats',
          localField: 'seat_number',
          foreignField: 'number',
          as: 'seat',
        },
      },
      { $unwind: { path: '$seat', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ['$seat.state', 'Unknown'] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 30 },
      { $project: { _id: 0, state: '$_id', count: 1 } },
    ]).toArray()

    // XP / level distribution
    const xpDistribution = await soulsCol.aggregate([
      { $group: { _id: '$level', souls: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, level: '$_id', souls: 1 } },
    ]).toArray()

    // Top 10 seats by vote count (current cycle or all time)
    const topSeats = await votesCol.aggregate([
      ...(liveCycle ? [{ $match: { cycle_id: liveCycle.id } }] : []),
      { $group: { _id: '$seat_number', totalVotes: { $sum: 1 } } },
      { $sort: { totalVotes: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, seatNumber: '$_id', totalVotes: 1 } },
    ]).toArray()

    return Response.json({
      totalCandidates,
      activeCandidates,
      withdrawnCandidates,
      totalVotes,
      totalSouls,
      totalParties,
      currentCycle: liveCycle
        ? {
            cycleNumber: liveCycle.cycle_number,
            status: liveCycle.status,
            snapshotAt: liveCycle.snapshot_at.toISOString(),
            votesThisCycle,
          }
        : null,
      votesByParty,
      candidatesByState,
      xpDistribution,
      topSeats,
    })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Stats fetch failed' },
      { status: 500 }
    )
  }
}
