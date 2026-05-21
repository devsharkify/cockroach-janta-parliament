import { candidates, votes, souls, cycles } from '@/lib/mongodb/collections'
import { HOT_SEATS } from '@/lib/hotSeats'

// Page-view counter: starts at 2.45M on launch day, grows ~10 000/hr
const LAUNCH_TS  = new Date('2026-05-21T00:00:00+05:30').getTime()
const BASE_VIEWS = 2_450_000
const VIEWS_PER_HOUR = 10_000

function calcPageViews(): number {
  const hoursElapsed = (Date.now() - LAUNCH_TS) / (1000 * 60 * 60)
  return BASE_VIEWS + Math.floor(hoursElapsed * VIEWS_PER_HOUR)
}

export async function GET() {
  const headers = { 'Cache-Control': 'max-age=30' }
  const pageViews = calcPageViews()

  // ── Mock mode (no DB) ──────────────────────────────────────────────────────
  if (!process.env.MONGODB_URI) {
    const now = Date.now()
    return Response.json(
      {
        totalCandidates: 12847,
        totalVotes: 394201,
        totalSeats: 543,
        activeCycle: true,
        nextSnapshot: new Date('2026-06-07T17:30:00Z').toISOString(),
        totalSouls: 8934,
        hotSeatCount: 26,
        pageViews,
        todayViews:      Math.floor(VIEWS_PER_HOUR * (new Date().getHours() + 1)),
        todayCandidates: 247,
        todayVotes:      18430,
        updatedAt: new Date(now).toISOString(),
      },
      { headers }
    )
  }

  // ── Live DB ────────────────────────────────────────────────────────────────
  const [candidatesCol, votesCol, soulsCol, cyclesCol] = await Promise.all([
    candidates(),
    votes(),
    souls(),
    cycles(),
  ])

  const hotSeatNumbers = HOT_SEATS.map(s => s.number)
  const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0)

  const [
    totalCandidates,
    totalVotes,
    totalSouls,
    liveCycle,
    hotSeatCount,
    todayCandidates,
    todayVotes,
  ] = await Promise.all([
    candidatesCol.countDocuments({ withdrawn: false }),
    votesCol.countDocuments({}),
    soulsCol.countDocuments({}),
    cyclesCol.findOne({ status: 'live' }, { sort: { cycle_number: -1 } }),
    candidatesCol.countDocuments({ seat_number: { $in: hotSeatNumbers }, withdrawn: false }),
    candidatesCol.countDocuments({ withdrawn: false, created_at: { $gte: startOfDay } }),
    votesCol.countDocuments({ created_at: { $gte: startOfDay } }),
  ])

  const todayHours = new Date().getHours() + 1
  const todayViews = Math.floor(VIEWS_PER_HOUR * todayHours)

  return Response.json(
    {
      totalCandidates,
      totalVotes,
      totalSeats: 543,
      activeCycle: liveCycle !== null,
      nextSnapshot: liveCycle ? liveCycle.snapshot_at.toISOString() : null,
      totalSouls,
      hotSeatCount,
      pageViews,
      todayViews,
      todayCandidates,
      todayVotes,
      updatedAt: new Date().toISOString(),
    },
    { headers }
  )
}
