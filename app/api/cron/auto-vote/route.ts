/**
 * POST /api/cron/auto-vote
 *
 * Synthetic-activity bot — call every 5 minutes via:
 *   • Vercel Cron (vercel.json, requires Pro for < daily)
 *   • External free cron: cron-job.org, EasyCron, etc.
 *     POST https://<domain>/api/cron/auto-vote
 *     Header: Authorization: Bearer <ADMIN_SECRET>
 *
 * What it does:
 *   1. Picks up to 25 random active candidates
 *   2. Generates 50–200 synthetic votes spread across them
 *   3. Ensures each bot voter has a unique fingerprint (never collides)
 *
 * Protected by ADMIN_SECRET env var.
 * Returns { ok, votes, candidates } — safe to log publicly.
 */

import { NextRequest } from 'next/server'
import { candidates, votes, cycles } from '@/lib/mongodb/collections'

export async function POST(req: NextRequest) {
  // ── Auth ─────────────────────────────────────────────────────────────────
  // Accepts: Bearer ADMIN_SECRET (external cron) OR Vercel's CRON_SECRET (built-in cron)
  const auth = req.headers.get('authorization') ?? ''
  const adminOk  = process.env.ADMIN_SECRET   && auth === `Bearer ${process.env.ADMIN_SECRET}`
  const cronOk   = process.env.CRON_SECRET    && auth === `Bearer ${process.env.CRON_SECRET}`
  if (!adminOk && !cronOk) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  // ── No DB → return gracefully ─────────────────────────────────────────────
  if (!process.env.MONGODB_URI) {
    return Response.json({ ok: true, votes: 0, candidates: 0, note: 'no_db' })
  }

  // ── Get live cycle ────────────────────────────────────────────────────────
  const cyclesCol = await cycles()
  const cycle = await cyclesCol.findOne({ status: 'live' }, { sort: { cycle_number: -1 } })
  if (!cycle) {
    return Response.json({ ok: true, votes: 0, candidates: 0, note: 'no_live_cycle' })
  }

  // ── Sample random candidates ──────────────────────────────────────────────
  const candidatesCol = await candidates()
  const sample = await candidatesCol.aggregate([
    { $match: { withdrawn: false } },
    { $sample: { size: 25 } },
  ]).toArray()

  if (sample.length === 0) {
    return Response.json({ ok: true, votes: 0, candidates: 0, note: 'no_candidates' })
  }

  // ── Generate votes ────────────────────────────────────────────────────────
  const votesCol = await votes()
  const voteCount = Math.floor(Math.random() * 151) + 50  // 50–200 per run
  const now = new Date()

  const docs = Array.from({ length: voteCount }, () => {
    const c = sample[Math.floor(Math.random() * sample.length)]
    return {
      id:                crypto.randomUUID(),
      candidate_id:      c.id as string,
      seat_number:       c.seat_number as number,
      cycle_id:          cycle.id,
      voter_fingerprint: `bot_${crypto.randomUUID().replace(/-/g, '')}`,
      ip_hash:           null,
      ua_hash:           null,
      created_at:        new Date(now.getTime() - Math.floor(Math.random() * 4 * 60 * 1000)),
    }
  })

  await votesCol.insertMany(docs, { ordered: false })

  return Response.json({
    ok:         true,
    votes:      voteCount,
    candidates: sample.length,
    cycleId:    cycle.id,
    ts:         now.toISOString(),
  })
}

// Also support GET so Vercel Cron (which uses GET) can call it
export async function GET(req: NextRequest) {
  return POST(req)
}
