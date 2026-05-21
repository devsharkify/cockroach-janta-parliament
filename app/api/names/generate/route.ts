import { NextRequest } from 'next/server'
import { generateCandidateName, generateHyperLocalName } from '@/lib/candidate_names'

// POST /api/names/generate
// Body: {
//   seatNumber?: number,
//   existingNames?: string[],
//   partyCode?: string,       // e.g. 'TVKP'
//   partyName?: string,       // e.g. 'Trending Virak Karo Party'
//   constituencyName?: string, // e.g. 'Malkajgiri'
//   state?: string,           // e.g. 'Telangana'
// }
// Returns: { name: string, pattern: string }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const existing = new Set<string>(body.existingNames ?? [])
  const { partyCode, partyName, constituencyName, state } = body

  // ── Hyper-local path: party + constituency supplied ──────────────────────
  if (partyCode && partyName && constituencyName) {
    for (let i = 0; i < 15; i++) {
      const result = generateHyperLocalName(partyCode, partyName, constituencyName, state)
      if (!existing.has(result.name)) {
        return Response.json({ name: result.name, pattern: result.pattern })
      }
    }
    // All hyper-local attempts collided (very unlikely) → fall through to generic
  }

  // ── Generic fallback ──────────────────────────────────────────────────────
  let result = generateCandidateName()
  for (let i = 0; i < 50 && existing.has(result.name); i++) {
    result = generateCandidateName()
  }

  return Response.json({ name: result.name, pattern: result.pattern })
}
