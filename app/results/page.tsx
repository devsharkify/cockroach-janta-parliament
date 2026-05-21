import type { Metadata } from 'next'
import ResultsContent from './ResultsContent'
import type { LeaderboardData } from '@/app/api/leaderboard/route'

export const metadata: Metadata = {
  title: 'Results — Cockroach Janta Parliament',
  description: 'Live leaderboard. Top cockroach candidates. Party standings. Trending seats.',
}

async function getLeaderboardData(): Promise<LeaderboardData> {
  // Import collection functions directly to avoid HTTP round-trip in server component
  if (process.env.MONGODB_URI) {
    const { votes } = await import('@/lib/mongodb/collections')

    const topCandidates = await (await votes()).aggregate<LeaderboardData['topCandidates'][number]>([
      { $group: { _id: '$candidate_id', voteCount: { $sum: 1 } } },
      { $sort: { voteCount: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'candidates', localField: '_id', foreignField: 'id', as: 'candidate' } },
      { $unwind: '$candidate' },
      { $match: { 'candidate.withdrawn': false } },
      { $lookup: { from: 'parties', localField: 'candidate.party_id', foreignField: 'id', as: 'party' } },
      { $lookup: { from: 'seats', localField: 'candidate.seat_number', foreignField: 'number', as: 'seat' } },
      {
        $project: {
          candidateId: '$_id',
          voteCount: 1,
          displayName: '$candidate.display_name',
          manifesto: '$candidate.manifesto',
          isIndependent: '$candidate.is_independent',
          seatNumber: '$candidate.seat_number',
          seatName: { $arrayElemAt: ['$seat.name', 0] },
          state: { $arrayElemAt: ['$seat.state', 0] },
          partyCode: { $arrayElemAt: ['$party.code', 0] },
          partyColor: { $arrayElemAt: ['$party.color', 0] },
          partyName: { $arrayElemAt: ['$party.name', 0] },
        },
      },
    ]).toArray()

    const partyStandings = await (await votes()).aggregate<LeaderboardData['partyStandings'][number]>([
      { $lookup: { from: 'candidates', localField: 'candidate_id', foreignField: 'id', as: 'c' } },
      { $unwind: '$c' },
      { $match: { 'c.party_id': { $ne: null } } },
      { $group: { _id: '$c.party_id', totalVotes: { $sum: 1 }, candidateCount: { $addToSet: '$c.id' } } },
      { $lookup: { from: 'parties', localField: '_id', foreignField: 'id', as: 'party' } },
      { $unwind: '$party' },
      {
        $project: {
          partyCode: '$party.code',
          partyName: '$party.name',
          partyColor: '$party.color',
          totalVotes: 1,
          candidateCount: { $size: '$candidateCount' },
        },
      },
      { $sort: { totalVotes: -1 } },
    ]).toArray()

    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const trendingSeats = await (await votes()).aggregate<LeaderboardData['trendingSeats'][number]>([
      { $match: { created_at: { $gte: since24h } } },
      { $group: { _id: '$seat_number', recentVotes: { $sum: 1 } } },
      { $sort: { recentVotes: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'seats', localField: '_id', foreignField: 'number', as: 'seat' } },
      {
        $project: {
          seatNumber: '$_id',
          recentVotes: 1,
          seatName: { $arrayElemAt: ['$seat.name', 0] },
          state: { $arrayElemAt: ['$seat.state', 0] },
        },
      },
    ]).toArray()

    const { candidates } = await import('@/lib/mongodb/collections')
    const nalalaAgg = await (await candidates()).aggregate<{ count: number }>([
      { $match: { withdrawn: false, party_id: { $ne: null } } },
      { $group: { _id: '$party_id', candidateCount: { $sum: 1 } } },
      { $match: { candidateCount: { $lt: 10 } } },
      { $group: { _id: null, count: { $sum: '$candidateCount' } } },
    ]).toArray()
    const nalalaCount = nalalaAgg[0]?.count ?? 0

    return { topCandidates, partyStandings, trendingSeats, nalalaCount, updatedAt: new Date().toISOString() }
  }

  // No MongoDB — call the route handler via HTTP (works in dev and production)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'
  const res = await fetch(`${baseUrl}/api/leaderboard`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch leaderboard data')
  return res.json() as Promise<LeaderboardData>
}

export default async function ResultsPage() {
  const data = await getLeaderboardData()
  return <ResultsContent data={data} />
}
