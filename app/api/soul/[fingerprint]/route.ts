import { souls } from '@/lib/mongodb/collections'

type Ctx = { params: Promise<{ fingerprint: string }> }

export async function GET(_req: Request, ctx: Ctx) {
  const { fingerprint } = await ctx.params

  if (!process.env.MONGODB_URI) {
    return Response.json({
      fingerprint,
      level: 2,
      xp: 42,
      streak_days: 3,
      total_votes: 10,
      total_candidacies: 1,
      achievements: [],
      isNew: false,
      _mock: true,
    })
  }

  const soulsCol = await souls()
  const soul = await soulsCol.findOne({ fingerprint })

  if (!soul) {
    return Response.json({
      fingerprint,
      level: 1,
      xp: 0,
      streak_days: 0,
      total_votes: 0,
      total_candidacies: 0,
      achievements: [],
      isNew: true,
    })
  }

  return Response.json({
    fingerprint: soul.fingerprint,
    level: soul.level,
    xp: soul.xp,
    streak_days: soul.streak_days,
    total_votes: soul.total_votes,
    total_candidacies: soul.total_candidacies,
    achievements: Object.keys(soul.achievements ?? {}),
    isNew: false,
  })
}
