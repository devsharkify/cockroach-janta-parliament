import { NextRequest } from 'next/server'
import { ecApplications } from '@/lib/mongodb/collections'
import { ALL_EC_POSITIONS } from '@/lib/ecPositions'
import type { ECApplicationDoc } from '@/lib/mongodb/collections'

// Mock data for local development
function mockApplications(): ECApplicationDoc[] {
  return [
    {
      id: 'ec-mock-1',
      position_id: 'cec',
      position_title: 'Chief Cockroach Election Commissioner',
      level: 'national',
      applicant_name: 'Ballot Box Bhattacharya',
      reason: 'I will ensure every roach gets exactly one vote, or maybe two, depends on bribe',
      fingerprint: 'mock-ec-fp-1',
      vote_count: 37,
      created_at: new Date('2025-01-01'),
    },
    {
      id: 'ec-mock-2',
      position_id: 'cec',
      position_title: 'Chief Cockroach Election Commissioner',
      level: 'national',
      applicant_name: 'EVM Ewaste Sharma',
      reason: 'My EVM machines only malfunction in my favour, very fair and balanced',
      fingerprint: 'mock-ec-fp-2',
      vote_count: 22,
      created_at: new Date('2025-01-02'),
    },
    {
      id: 'ec-mock-3',
      position_id: 'cec',
      position_title: 'Chief Cockroach Election Commissioner',
      level: 'national',
      applicant_name: 'Naali Nirvachan Nair',
      reason: 'I once counted 10,000 votes in 5 minutes, all for myself',
      fingerprint: 'mock-ec-fp-3',
      vote_count: 11,
      created_at: new Date('2025-01-03'),
    },
  ]
}

// GET /api/ec?position_id=cec  → { position, applications }
// GET /api/ec?all=1            → all positions with applicant counts
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const positionId = searchParams.get('position_id')
  const all = searchParams.get('all')

  if (all === '1') {
    if (!process.env.MONGODB_URI) {
      const positions = ALL_EC_POSITIONS.map(p => ({ ...p, applicant_count: p.id === 'cec' ? 3 : 0 }))
      return Response.json({ positions, _mock: true })
    }
    const col = await ecApplications()
    const counts = await col.aggregate<{ _id: string; count: number }>([
      { $group: { _id: '$position_id', count: { $sum: 1 } } },
    ]).toArray()
    const countMap: Record<string, number> = {}
    for (const c of counts) countMap[c._id] = c.count
    const positions = ALL_EC_POSITIONS.map(p => ({ ...p, applicant_count: countMap[p.id] ?? 0 }))
    return Response.json({ positions })
  }

  if (positionId) {
    const position = ALL_EC_POSITIONS.find(p => p.id === positionId)
    if (!position) return Response.json({ error: 'Position not found' }, { status: 404 })

    if (!process.env.MONGODB_URI) {
      const applications = positionId === 'cec' ? mockApplications() : []
      return Response.json({ position, applications, _mock: true })
    }
    const col = await ecApplications()
    const applications = await col
      .find({ position_id: positionId })
      .sort({ vote_count: -1, created_at: 1 })
      .toArray()
    const cleanApps = applications.map(({ _id: _omit, ...rest }) => rest)
    return Response.json({ position, applications: cleanApps })
  }

  return Response.json({ error: 'Provide ?position_id=... or ?all=1' }, { status: 400 })
}

// POST /api/ec
// body: { positionId, applicantName, reason, fingerprint }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return Response.json({ error: 'Invalid body' }, { status: 400 })

  const { positionId, applicantName, reason, fingerprint } = body

  if (!positionId || !applicantName || !reason || !fingerprint) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const position = ALL_EC_POSITIONS.find(p => p.id === String(positionId))
  if (!position) return Response.json({ error: 'Invalid position' }, { status: 400 })

  const name = String(applicantName).trim()
  if (name.length < 3 || name.length > 40) {
    return Response.json({ error: 'Name must be 3–40 characters' }, { status: 400 })
  }

  const reasonStr = String(reason).trim()
  if (reasonStr.length < 1 || reasonStr.length > 120) {
    return Response.json({ error: 'Reason must be 1–120 characters' }, { status: 400 })
  }

  if (!process.env.MONGODB_URI) {
    const mockApp: Omit<ECApplicationDoc, '_id'> = {
      id: crypto.randomUUID(),
      position_id: position.id,
      position_title: position.title,
      level: position.level,
      state: position.state,
      applicant_name: name,
      reason: reasonStr,
      fingerprint: String(fingerprint),
      vote_count: 0,
      created_at: new Date(),
    }
    return Response.json({ application: mockApp, _mock: true })
  }

  const col = await ecApplications()

  // 1 application per fingerprint per position
  const existing = await col.findOne({ fingerprint: String(fingerprint), position_id: position.id })
  if (existing) {
    return Response.json({ error: 'You have already applied for this position' }, { status: 409 })
  }

  const id = crypto.randomUUID()
  const now = new Date()
  const doc: Omit<ECApplicationDoc, '_id'> = {
    id,
    position_id: position.id,
    position_title: position.title,
    level: position.level,
    state: position.state,
    applicant_name: name,
    reason: reasonStr,
    fingerprint: String(fingerprint),
    vote_count: 0,
    created_at: now,
  }
  await col.insertOne(doc)

  return Response.json({ application: doc })
}
