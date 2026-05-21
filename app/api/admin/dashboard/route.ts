import { NextRequest } from 'next/server'
import { candidates, votes, souls, cycles, parties } from '@/lib/mongodb/collections'
import clientPromise from '@/lib/mongodb/client'

// ── PIN is checked server-side — never exposed to client ──────────────────
const ADMIN_PIN = process.env.ADMIN_PIN ?? '003003'

function checkPin(req: NextRequest): boolean {
  const pin = req.nextUrl.searchParams.get('pin') ?? req.headers.get('x-admin-pin') ?? ''
  return pin === ADMIN_PIN
}

// ── Page-view estimate ────────────────────────────────────────────────────
const LAUNCH_TS       = new Date('2026-05-21T00:00:00+05:30').getTime()
const BASE_VIEWS      = 2_450_000
const VIEWS_PER_HOUR  = 10_000

function calcPageViews() {
  return BASE_VIEWS + Math.floor(((Date.now() - LAUNCH_TS) / 3_600_000) * VIEWS_PER_HOUR)
}

// ── Build 7-day date keys (YYYY-MM-DD in IST) ────────────────────────────
function last7DayKeys(): { key: string; label: string; dayOffset: number }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86_400_000)
    const key = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) // YYYY-MM-DD
    const label = d.toLocaleDateString('en-IN', { weekday: 'short', timeZone: 'Asia/Kolkata' })
    return { key, label, dayOffset: 6 - i }
  })
}

// ── Mock daily analytics (realistic curve) ───────────────────────────────
function mockDailyStats() {
  const bases = { candidates: [312, 287, 403, 521, 398, 476, 247], votes: [22400, 19800, 28700, 35100, 27600, 31200, 18430] }
  return last7DayKeys().map(({ key, label }, i) => ({
    date: key, label,
    candidates: bases.candidates[i],
    votes: bases.votes[i],
    pageViews: Math.floor(VIEWS_PER_HOUR * 18 * (0.7 + Math.random() * 0.6)),
  }))
}

/* ══════════════════════════════════════════════════════════════
   GET — full stats
══════════════════════════════════════════════════════════════ */
export async function GET(req: NextRequest) {
  if (!checkPin(req)) return Response.json({ error: 'Wrong PIN.' }, { status: 401 })

  const forceMock = req.nextUrl.searchParams.get('mock') === '1'
  const pageViews = calcPageViews()
  const todayViews = Math.floor(VIEWS_PER_HOUR * (new Date().getHours() + 1))

  // ── MOCK MODE (no DB or forced) ────────────────────────────────────────
  if (!process.env.MONGODB_URI || forceMock) {
    return Response.json({
      isMock: true,
      totalCandidates: 12847,
      activeCandidates: 11203,
      withdrawnCandidates: 1644,
      totalVotes: 394201,
      totalSouls: 8934,
      totalParties: 23,
      pageViews,
      todayViews,
      todayCandidates: 247,
      todayVotes: 18430,
      userArticles: 14,
      currentCycle: {
        cycleNumber: 3,
        status: 'live',
        snapshotAt: (() => {
          // Next Sunday 11PM IST (17:30 UTC)
          const d = new Date()
          const daysUntilSun = (7 - d.getDay()) % 7 || 7
          d.setDate(d.getDate() + daysUntilSun)
          d.setUTCHours(17, 30, 0, 0)
          return d.toISOString()
        })(),
        votesThisCycle: 47823,
      },
      votesByParty: [
        { partyCode: 'CJP',  partyName: 'Cockroach Janta Party',         votes: 89012 },
        { partyCode: 'ACP',  partyName: 'Aam Cockroach Party',           votes: 72341 },
        { partyCode: 'IND',  partyName: 'Independent',                   votes: 61011 },
        { partyCode: 'CCP',  partyName: 'Classic Cockroach Party',       votes: 48203 },
        { partyCode: 'TVKP', partyName: 'Thalaiva Viral Keetam Party',   votes: 32187 },
        { partyCode: 'DMK',  partyName: 'Drain Mein Koi Party',          votes: 21034 },
        { partyCode: 'RWU',  partyName: 'Reel Workers Union',            votes: 18201 },
        { partyCode: 'BSS',  partyName: 'Broom Sambhav Sena',            votes: 14876 },
      ],
      candidatesByState: [
        { state: 'Uttar Pradesh', count: 2134 },
        { state: 'Maharashtra',   count: 1876 },
        { state: 'Bihar',         count: 1543 },
        { state: 'West Bengal',   count: 1201 },
        { state: 'Tamil Nadu',    count: 987  },
        { state: 'Karnataka',     count: 876  },
        { state: 'Rajasthan',     count: 754  },
        { state: 'Madhya Pradesh',count: 712  },
        { state: 'Telangana',     count: 634  },
        { state: 'Andhra Pradesh',count: 598  },
      ],
      xpDistribution: [
        { level: 1, souls: 5012 },
        { level: 2, souls: 2341 },
        { level: 3, souls: 891  },
        { level: 4, souls: 512  },
        { level: 5, souls: 178  },
      ],
      topSeats: [
        { seatNumber: 1,   totalVotes: 4312 },
        { seatNumber: 400, totalVotes: 3987 },
        { seatNumber: 230, totalVotes: 3654 },
        { seatNumber: 485, totalVotes: 3201 },
        { seatNumber: 12,  totalVotes: 2987 },
        { seatNumber: 77,  totalVotes: 2745 },
        { seatNumber: 310, totalVotes: 2503 },
        { seatNumber: 200, totalVotes: 2301 },
        { seatNumber: 543, totalVotes: 2198 },
        { seatNumber: 99,  totalVotes: 2012 },
      ],
      dailyStats: mockDailyStats(),
    })
  }

  // ── LIVE DB ────────────────────────────────────────────────────────────
  try {
    const [candidatesCol, votesCol, soulsCol, cyclesCol, partiesCol] = await Promise.all([
      candidates(), votes(), souls(), cycles(), parties(),
    ])

    const startOfDay   = new Date(); startOfDay.setHours(0, 0, 0, 0)
    const sevenDaysAgo = new Date(Date.now() - 7 * 86_400_000)
    const liveCycle    = await cyclesCol.findOne({ status: 'live' }, { sort: { cycle_number: -1 } })

    const [
      totalCandidates, activeCandidates, withdrawnCandidates,
      totalVotes, totalSouls, totalParties,
      todayCandidates, todayVotes,
    ] = await Promise.all([
      candidatesCol.countDocuments({}),
      candidatesCol.countDocuments({ withdrawn: false }),
      candidatesCol.countDocuments({ withdrawn: true }),
      votesCol.countDocuments({}),
      soulsCol.countDocuments({}),
      partiesCol.countDocuments({}),
      candidatesCol.countDocuments({ withdrawn: false, created_at: { $gte: startOfDay } }),
      votesCol.countDocuments({ created_at: { $gte: startOfDay } }),
    ])

    const votesThisCycle = liveCycle
      ? await votesCol.countDocuments({ cycle_id: liveCycle.id })
      : 0

    // ── 7-day daily breakdown ──────────────────────────────────────────
    const [dailyCand, dailyVote] = await Promise.all([
      candidatesCol.aggregate([
        { $match: { created_at: { $gte: sevenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at', timezone: '+05:30' } }, count: { $sum: 1 } } },
      ]).toArray(),
      votesCol.aggregate([
        { $match: { created_at: { $gte: sevenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at', timezone: '+05:30' } }, count: { $sum: 1 } } },
      ]).toArray(),
    ])

    const dailyStats = last7DayKeys().map(({ key, label }) => ({
      date:       key,
      label,
      candidates: (dailyCand.find((r: any) => r._id === key)?.count ?? 0) as number,
      votes:      (dailyVote.find((r: any) => r._id === key)?.count ?? 0) as number,
      pageViews:  Math.floor(VIEWS_PER_HOUR * 18), // estimated per day
    }))

    // ── Aggregations ───────────────────────────────────────────────────
    const [votesByParty, candidatesByState, xpDistribution, topSeats] = await Promise.all([
      votesCol.aggregate([
        ...(liveCycle ? [{ $match: { cycle_id: liveCycle.id } }] : []),
        { $lookup: { from: 'candidates', localField: 'candidate_id', foreignField: 'id', as: 'candidate' } },
        { $unwind: { path: '$candidate', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'parties', localField: 'candidate.party_id', foreignField: 'id', as: 'party' } },
        { $unwind: { path: '$party', preserveNullAndEmptyArrays: true } },
        { $group: { _id: { partyCode: { $ifNull: ['$party.code', 'IND'] }, partyName: { $ifNull: ['$party.name', 'Independent'] } }, votes: { $sum: 1 } } },
        { $sort: { votes: -1 } }, { $limit: 20 },
        { $project: { _id: 0, partyCode: '$_id.partyCode', partyName: '$_id.partyName', votes: 1 } },
      ]).toArray(),

      candidatesCol.aggregate([
        { $match: { withdrawn: false } },
        { $lookup: { from: 'seats', localField: 'seat_number', foreignField: 'number', as: 'seat' } },
        { $unwind: { path: '$seat', preserveNullAndEmptyArrays: true } },
        { $group: { _id: { $ifNull: ['$seat.state', 'Unknown'] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } }, { $limit: 30 },
        { $project: { _id: 0, state: '$_id', count: 1 } },
      ]).toArray(),

      soulsCol.aggregate([
        { $group: { _id: '$level', souls: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, level: '$_id', souls: 1 } },
      ]).toArray(),

      votesCol.aggregate([
        ...(liveCycle ? [{ $match: { cycle_id: liveCycle.id } }] : []),
        { $group: { _id: '$seat_number', totalVotes: { $sum: 1 } } },
        { $sort: { totalVotes: -1 } }, { $limit: 10 },
        { $project: { _id: 0, seatNumber: '$_id', totalVotes: 1 } },
      ]).toArray(),
    ])

    const client = await clientPromise
    const db = client.db('cockroach_parliament')
    const userArticles = await db.collection('user_articles').countDocuments({})

    return Response.json({
      isMock: false,
      totalCandidates, activeCandidates, withdrawnCandidates,
      totalVotes, totalSouls, totalParties,
      pageViews, todayViews, todayCandidates, todayVotes,
      userArticles,
      currentCycle: liveCycle ? {
        cycleNumber:     liveCycle.cycle_number,
        status:          liveCycle.status,
        snapshotAt:      liveCycle.snapshot_at.toISOString(),
        votesThisCycle,
      } : null,
      votesByParty, candidatesByState, xpDistribution, topSeats, dailyStats,
    })
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : 'DB error' }, { status: 500 })
  }
}

/* ══════════════════════════════════════════════════════════════
   POST — trigger snapshot
══════════════════════════════════════════════════════════════ */
export async function POST(req: NextRequest) {
  if (!checkPin(req)) return Response.json({ error: 'Wrong PIN.' }, { status: 401 })

  if (!process.env.MONGODB_URI) {
    return Response.json({ error: 'No database configured.' }, { status: 503 })
  }

  try {
    const cyclesCol = await cycles()
    const votesCol  = await votes()
    const liveCycle = await cyclesCol.findOne({ status: 'live' })
    if (!liveCycle) return Response.json({ error: 'No live cycle found.' }, { status: 404 })

    const winners = await votesCol.aggregate([
      { $match: { cycle_id: liveCycle.id } },
      { $group: { _id: { seat_number: '$seat_number', candidate_id: '$candidate_id' }, count: { $sum: 1 } } },
      { $sort: { '_id.seat_number': 1, count: -1 } },
      { $group: { _id: '$_id.seat_number', winner_candidate_id: { $first: '$_id.candidate_id' }, total_votes: { $first: '$count' } } },
    ]).toArray()

    const client    = await clientPromise
    const db        = client.db(process.env.MONGODB_DB ?? 'cockroach_parliament')
    const resultsCol = db.collection('results')

    if (winners.length > 0) {
      await resultsCol.bulkWrite(winners.map((w: any) => ({
        updateOne: {
          filter: { cycle_id: liveCycle.id, seat_number: w._id },
          update: { $set: { cycle_id: liveCycle.id, seat_number: w._id, winner_candidate_id: w.winner_candidate_id, total_votes: w.total_votes, created_at: new Date() } },
          upsert: true,
        },
      })))
    }

    await cyclesCol.updateOne({ id: liveCycle.id }, { $set: { status: 'closed' } })

    const nextSun = new Date()
    const daysUntilSun = (7 - nextSun.getDay()) % 7 || 7
    nextSun.setDate(nextSun.getDate() + daysUntilSun)
    nextSun.setUTCHours(17, 30, 0, 0)

    const nextCycle = {
      id:           crypto.randomUUID(),
      cycle_number: liveCycle.cycle_number + 1,
      starts_at:    new Date(),
      snapshot_at:  nextSun,
      ends_at:      new Date(nextSun.getTime() + 3_600_000),
      status:       'live' as const,
      created_at:   new Date(),
    }
    await cyclesCol.insertOne(nextCycle)

    return Response.json({
      success:        true,
      cycleNumber:    liveCycle.cycle_number,
      winnersComputed: winners.length,
      nextCycleId:    nextCycle.id,
    })
  } catch (err) {
    return Response.json({ error: err instanceof Error ? err.message : 'Snapshot failed' }, { status: 500 })
  }
}
