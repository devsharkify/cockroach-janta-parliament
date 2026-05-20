import { votes } from '@/lib/mongodb/collections'

export type TopCandidate = {
  candidateId: string
  voteCount: number
  displayName: string
  manifesto: string
  isIndependent: boolean
  seatNumber: number
  seatName: string
  state: string
  partyCode: string | null
  partyColor: string | null
  partyName: string | null
}

export type PartyStanding = {
  partyCode: string
  partyName: string
  partyColor: string
  totalVotes: number
  candidateCount: number
}

export type TrendingSeat = {
  seatNumber: number
  seatName: string
  state: string
  recentVotes: number
}

export type LeaderboardData = {
  topCandidates: TopCandidate[]
  partyStandings: PartyStanding[]
  trendingSeats: TrendingSeat[]
  updatedAt: string
}

const MOCK_DATA: LeaderboardData = {
  topCandidates: [
    { candidateId: 'mock-1', voteCount: 47823, displayName: 'Naala_Sardar_OG', manifesto: 'Har ward mein drainage DJ night.', seatNumber: 52, seatName: 'Patna Sahib', state: 'Bihar', partyCode: 'CJP', partyColor: '#7F77DD', partyName: 'Cockroach Janta Party', isIndependent: false },
    { candidateId: 'mock-2', voteCount: 38201, displayName: 'Mumbai_Kachra_official', manifesto: 'Free naali for all roaches.', seatNumber: 485, seatName: 'Varanasi', state: 'UP', partyCode: 'ACP', partyColor: '#1D9E75', partyName: 'Aam Cockroach Party', isIndependent: false },
    { candidateId: 'mock-3', voteCount: 29450, displayName: 'Delhi_Drain_King', manifesto: 'Every manhole is a throne.', seatNumber: 101, seatName: 'New Delhi', state: 'Delhi', partyCode: 'CJP', partyColor: '#7F77DD', partyName: 'Cockroach Janta Party', isIndependent: false },
    { candidateId: 'mock-4', voteCount: 21887, displayName: 'Bangalore_Khatmal', manifesto: 'Tech hub? More like naali hub.', seatNumber: 173, seatName: 'Bengaluru Central', state: 'Karnataka', partyCode: 'RCP', partyColor: '#D4537E', partyName: 'Regional Cockroach Party', isIndependent: false },
    { candidateId: 'mock-5', voteCount: 18234, displayName: 'Hyderabad_Manhole_OG', manifesto: 'Biryani for cockroaches.', seatNumber: 393, seatName: 'Hyderabad', state: 'Telangana', partyCode: 'ACP', partyColor: '#1D9E75', partyName: 'Aam Cockroach Party', isIndependent: false },
    { candidateId: 'mock-6', voteCount: 15421, displayName: 'Galli_da_real_444', manifesto: 'Galliyon ki awaaz.', seatNumber: 467, seatName: 'Lucknow', state: 'UP', partyCode: 'CCP', partyColor: '#D85A30', partyName: 'Cockroach Congress Party', isIndependent: false },
    { candidateId: 'mock-7', voteCount: 12089, displayName: 'Kochin_Cockroach', manifesto: 'Kerala roach solidarity.', seatNumber: 203, seatName: 'Ernakulam', state: 'Kerala', partyCode: null, partyColor: null, partyName: null, isIndependent: true },
    { candidateId: 'mock-8', voteCount: 9876, displayName: 'Pune_Pest_Control', manifesto: 'Anti-broom movement.', seatNumber: 260, seatName: 'Pune', state: 'Maharashtra', partyCode: 'CCP', partyColor: '#D85A30', partyName: 'Cockroach Congress Party', isIndependent: false },
    { candidateId: 'mock-9', voteCount: 8234, displayName: 'Amritsar_Khatmal', manifesto: 'Punjab da roach.', seatNumber: 313, seatName: 'Amritsar', state: 'Punjab', partyCode: 'RCP', partyColor: '#D4537E', partyName: 'Regional Cockroach Party', isIndependent: false },
    { candidateId: 'mock-10', voteCount: 6543, displayName: 'Kolkata_Cockroach', manifesto: 'Naali amar jothe thake.', seatNumber: 497, seatName: 'Kolkata North', state: 'West Bengal', partyCode: 'CJP', partyColor: '#7F77DD', partyName: 'Cockroach Janta Party', isIndependent: false },
  ],
  partyStandings: [
    { partyCode: 'CJP', partyName: 'Cockroach Janta Party', partyColor: '#7F77DD', totalVotes: 142390, candidateCount: 187 },
    { partyCode: 'ACP', partyName: 'Aam Cockroach Party', partyColor: '#1D9E75', totalVotes: 98234, candidateCount: 143 },
    { partyCode: 'CCP', partyName: 'Cockroach Congress Party', partyColor: '#D85A30', totalVotes: 76821, candidateCount: 121 },
    { partyCode: 'RCP', partyName: 'Regional Cockroach Party', partyColor: '#D4537E', totalVotes: 54123, candidateCount: 89 },
  ],
  trendingSeats: [
    { seatNumber: 485, seatName: 'Varanasi', state: 'Uttar Pradesh', recentVotes: 4201 },
    { seatNumber: 52, seatName: 'Patna Sahib', state: 'Bihar', recentVotes: 3892 },
    { seatNumber: 101, seatName: 'New Delhi', state: 'Delhi', recentVotes: 2901 },
    { seatNumber: 173, seatName: 'Bengaluru Central', state: 'Karnataka', recentVotes: 2103 },
    { seatNumber: 393, seatName: 'Hyderabad', state: 'Telangana', recentVotes: 1876 },
  ],
  updatedAt: new Date().toISOString(),
}

export async function GET() {
  const headers = { 'Cache-Control': 'no-store' }

  if (!process.env.MONGODB_URI) {
    return Response.json({ ...MOCK_DATA, updatedAt: new Date().toISOString() }, { headers })
  }

  // Top 10 candidates by total votes (any cycle)
  const topCandidates = await (await votes()).aggregate<TopCandidate>([
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

  // Party standings
  const partyStandings = await (await votes()).aggregate<PartyStanding>([
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

  // Trending seats (most votes in last 24h)
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const trendingSeats = await (await votes()).aggregate<TrendingSeat>([
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

  const data: LeaderboardData = {
    topCandidates,
    partyStandings,
    trendingSeats,
    updatedAt: new Date().toISOString(),
  }

  return Response.json(data, { headers })
}
