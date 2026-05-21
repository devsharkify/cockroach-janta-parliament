import { ObjectId, type Collection } from 'mongodb'
import clientPromise from './client'
import { ensureIndexes } from './indexes'

const DB = process.env.MONGODB_DB ?? 'cockroach_parliament'

let _indexesEnsured = false

async function db() {
  const client = await clientPromise
  if (!_indexesEnsured) {
    _indexesEnsured = true
    ensureIndexes().catch((err) => console.error('ensureIndexes error:', err))
  }
  return client.db(DB)
}

// ── Document interfaces ──────────────────────────────────────────

export interface SeatDoc {
  _id?: ObjectId
  number: number
  slug: string
  name: string
  state: string
  state_code: string
}

export interface PartyDoc {
  _id?: ObjectId
  id: string          // UUID string
  code: string
  name: string
  color: string
  tagline: string | null
  logo_url: string | null
  founder_fingerprint: string | null
  is_founding: boolean
  created_at: Date
}

export interface CycleDoc {
  _id?: ObjectId
  id: string
  cycle_number: number
  starts_at: Date
  snapshot_at: Date
  ends_at: Date
  status: 'live' | 'closed'
  created_at: Date
}

export interface CandidateDoc {
  _id?: ObjectId
  id: string            // UUID string
  seat_number: number
  display_name: string
  manifesto: string
  claim_code_hash: string | null
  party_id: string | null
  is_independent: boolean
  filer_fingerprint: string | null
  ig_handle: string | null
  ig_shared: boolean
  withdrawn: boolean
  created_at: Date
}

export interface VoteDoc {
  _id?: ObjectId
  cycle_id: string | null
  candidate_id: string
  seat_number: number
  voter_fingerprint: string | null
  ip_hash: string | null
  ua_hash: string | null
  created_at: Date
}

export interface ResultDoc {
  _id?: ObjectId
  id: string
  cycle_id: string | null
  seat_number: number | null
  winner_candidate_id: string | null
  total_votes: number | null
  margin: number | null
  created_at: Date
}

export interface DecreeDoc {
  _id?: ObjectId
  id: string
  cycle_id: string | null
  decree_text: string
  address_text: string | null
  posted_at: Date
}

export interface SoulDoc {
  _id?: ObjectId
  fingerprint: string   // unique index
  level: number
  xp: number
  streak_days: number
  last_visit_date: Date | null
  total_votes: number
  total_candidacies: number
  total_nominations: number
  achievements: Record<string, unknown>
  created_at: Date
}

export interface NewsItemDoc {
  _id?: ObjectId
  id: string
  cycle_id: string | null
  headline: string
  body: string | null
  related_seat: number | null
  related_candidate_id: string | null
  generated_at: Date
}

// ── Collection getters ───────────────────────────────────────────

export async function seats(): Promise<Collection<SeatDoc>> {
  return (await db()).collection<SeatDoc>('seats')
}
export async function parties(): Promise<Collection<PartyDoc>> {
  return (await db()).collection<PartyDoc>('parties')
}
export async function cycles(): Promise<Collection<CycleDoc>> {
  return (await db()).collection<CycleDoc>('cycles')
}
export async function candidates(): Promise<Collection<CandidateDoc>> {
  return (await db()).collection<CandidateDoc>('candidates')
}
export async function votes(): Promise<Collection<VoteDoc>> {
  return (await db()).collection<VoteDoc>('votes')
}
export async function souls(): Promise<Collection<SoulDoc>> {
  return (await db()).collection<SoulDoc>('souls')
}
export async function newsItems(): Promise<Collection<NewsItemDoc>> {
  return (await db()).collection<NewsItemDoc>('news_items')
}
