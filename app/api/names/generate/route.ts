import { NextRequest } from 'next/server'
import { generateCandidateName } from '@/lib/candidate_names'

// POST /api/names/generate
// Body: { seatNumber: number, existingNames?: string[] }
// Returns: { name: string, pattern: string }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const existing = new Set<string>(body.existingNames ?? [])

  let result = generateCandidateName()
  let attempts = 0
  while (existing.has(result.name) && attempts < 50) {
    result = generateCandidateName()
    attempts++
  }

  return Response.json({ name: result.name, pattern: result.pattern })
}
