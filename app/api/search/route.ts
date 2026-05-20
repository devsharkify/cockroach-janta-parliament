import type { NextRequest } from 'next/server'
import { seats, candidates } from '@/lib/mongodb/collections'

type SearchResult = {
  type: 'seat' | 'candidate'
  id: string
  label: string
  seatNumber: number
  secondary: string
}

const NO_CACHE = { 'Cache-Control': 'no-store' }

const MOCK: SearchResult[] = [
  { type: 'seat', id: '485', label: 'Varanasi', seatNumber: 485, secondary: 'Uttar Pradesh' },
  { type: 'seat', id: '101', label: 'New Delhi', seatNumber: 101, secondary: 'Delhi' },
  { type: 'candidate', id: 'mock-1', label: 'Naali_Naresh_42', seatNumber: 485, secondary: 'Seat 485' },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const raw = searchParams.get('q') ?? ''
  const q = raw.trim().slice(0, 50)

  if (q.length < 2) {
    return Response.json([], { headers: NO_CACHE })
  }

  // Mock path
  if (!process.env.MONGODB_URI) {
    return Response.json(MOCK.filter(r => r.label.toLowerCase().includes(q.toLowerCase())).slice(0, 8), { headers: NO_CACHE })
  }

  // MongoDB path
  const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')

  const [seatDocs, candidateDocs] = await Promise.all([
    (await seats()).find({ name: { $regex: regex } }).limit(4).toArray(),
    (await candidates()).find({ display_name: { $regex: regex }, withdrawn: false }).limit(4).toArray(),
  ])

  const seatResults: SearchResult[] = seatDocs.map(s => ({
    type: 'seat',
    id: String(s.number),
    label: s.name,
    seatNumber: s.number,
    secondary: s.state,
  }))

  const candidateResults: SearchResult[] = candidateDocs.map(c => ({
    type: 'candidate',
    id: c.id,
    label: c.display_name,
    seatNumber: c.seat_number,
    secondary: 'Seat ' + c.seat_number,
  }))

  return Response.json([...seatResults, ...candidateResults].slice(0, 8), { headers: NO_CACHE })
}
