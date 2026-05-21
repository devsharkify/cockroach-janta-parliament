import { NextRequest } from 'next/server'
import { courtApplications } from '@/lib/mongodb/collections'
import { ALL_COURT_POSITIONS } from '@/lib/courtPositions'
import type { CourtApplicationDoc } from '@/lib/mongodb/collections'

// Mock data for local development
function mockApplications(): CourtApplicationDoc[] {
  return [
    {
      id: 'mock-1',
      position_id: 'cji',
      position_title: 'Chief Cockroach Justice of India',
      level: 'national',
      applicant_name: 'Kachra Kumar Nyaymurti',
      reason: 'I have lived in the drain long enough to understand the law of the gutter',
      fingerprint: 'mock-fp-1',
      vote_count: 42,
      created_at: new Date('2025-01-01'),
    },
    {
      id: 'mock-2',
      position_id: 'cji',
      position_title: 'Chief Cockroach Justice of India',
      level: 'national',
      applicant_name: 'Naali Nayak Roachswami',
      reason: 'Justice must be served cold, like yesterday\'s biryani',
      fingerprint: 'mock-fp-2',
      vote_count: 28,
      created_at: new Date('2025-01-02'),
    },
    {
      id: 'mock-3',
      position_id: 'cji',
      position_title: 'Chief Cockroach Justice of India',
      level: 'national',
      applicant_name: 'Sewer Sahib Pillai',
      reason: 'I have memorized all 543 naali bylaws and their amendments',
      fingerprint: 'mock-fp-3',
      vote_count: 15,
      created_at: new Date('2025-01-03'),
    },
  ]
}

// GET /api/court?position_id=cji  → { position, applications }
// GET /api/court?all=1            → all positions with applicant counts
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const positionId = searchParams.get('position_id')
  const all = searchParams.get('all')

  if (all === '1') {
    // Return all positions with applicant counts
    if (!process.env.MONGODB_URI) {
      const positions = ALL_COURT_POSITIONS.map(p => ({ ...p, applicant_count: p.id === 'cji' ? 3 : 0 }))
      return Response.json({ positions, _mock: true })
    }
    const col = await courtApplications()
    const counts = await col.aggregate<{ _id: string; count: number }>([
      { $group: { _id: '$position_id', count: { $sum: 1 } } },
    ]).toArray()
    const countMap: Record<string, number> = {}
    for (const c of counts) countMap[c._id] = c.count
    const positions = ALL_COURT_POSITIONS.map(p => ({ ...p, applicant_count: countMap[p.id] ?? 0 }))
    return Response.json({ positions })
  }

  if (positionId) {
    const position = ALL_COURT_POSITIONS.find(p => p.id === positionId)
    if (!position) return Response.json({ error: 'Position not found' }, { status: 404 })

    if (!process.env.MONGODB_URI) {
      const applications = positionId === 'cji' ? mockApplications() : []
      return Response.json({ position, applications, _mock: true })
    }
    const col = await courtApplications()
    const applications = await col
      .find({ position_id: positionId })
      .sort({ vote_count: -1, created_at: 1 })
      .toArray()
    // Strip MongoDB _id for serialization
    const cleanApps = applications.map(({ _id: _omit, ...rest }) => rest)
    return Response.json({ position, applications: cleanApps })
  }

  return Response.json({ error: 'Provide ?position_id=... or ?all=1' }, { status: 400 })
}

// POST /api/court
// body: { positionId, applicantName, reason, fingerprint }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return Response.json({ error: 'Invalid body' }, { status: 400 })

  const { positionId, applicantName, reason, fingerprint } = body

  if (!positionId || !applicantName || !reason || !fingerprint) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const position = ALL_COURT_POSITIONS.find(p => p.id === String(positionId))
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
    const mockApp: Omit<CourtApplicationDoc, '_id'> = {
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

  const col = await courtApplications()

  // 1 application per fingerprint per position
  const existing = await col.findOne({ fingerprint: String(fingerprint), position_id: position.id })
  if (existing) {
    return Response.json({ error: 'You have already applied for this position' }, { status: 409 })
  }

  const id = crypto.randomUUID()
  const now = new Date()
  const doc: Omit<CourtApplicationDoc, '_id'> = {
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
