/**
 * Seeds all collections in order:
 *   1. seats (from CSV)
 *   2. founding parties
 *   3. cycle 1
 *
 * Run: npx tsx scripts/seed-all.ts
 * Requires MONGODB_URI in .env.local
 */

import { MongoClient } from 'mongodb'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { config } from 'dotenv'

config({ path: resolve(process.cwd(), '.env.local') })

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('Missing MONGODB_URI in .env.local')
  process.exit(1)
}

async function main() {
  const client = new MongoClient(uri!)
  await client.connect()
  const db = client.db(process.env.MONGODB_DB ?? 'cockroach_parliament')

  try {
    console.log('Starting full seed...\n')

    // ── 1. Seats ──────────────────────────────────────────────────────────
    const csvPath = resolve(process.cwd(), 'data/lok_sabha_seats_543.csv')
    const lines = readFileSync(csvPath, 'utf-8').trim().split('\n')
    const seatDocs = lines.slice(1).map(line => {
      const v = line.split(',')
      return { number: parseInt(v[0], 10), slug: v[1], name: v[2], state: v[3], state_code: v[4] }
    })

    const seatsCol = db.collection('seats')
    await seatsCol.createIndex({ number: 1 }, { unique: true })
    const seatOps = seatDocs.map(s => ({
      updateOne: { filter: { number: s.number }, update: { $set: s }, upsert: true },
    }))
    await seatsCol.bulkWrite(seatOps, { ordered: false })
    console.log(`✓ ${seatDocs.length} seats seeded`)

    // ── 2. Founding parties ───────────────────────────────────────────────
    const partiesCol = db.collection('parties')
    await partiesCol.createIndex({ code: 1 }, { unique: true })
    await partiesCol.createIndex({ id: 1 }, { unique: true })

    const partyDocs = [
      { id: crypto.randomUUID(), code: 'CJP', name: 'Cockroach Janta Party',    color: '#7F77DD', tagline: 'Lazy, Loud, Lawful',                 logo_url: null, founder_fingerprint: null, is_founding: true, created_at: new Date() },
      { id: crypto.randomUUID(), code: 'CCP', name: 'Cockroach Congress Party',  color: '#D85A30', tagline: 'Old Roach Magic',                    logo_url: null, founder_fingerprint: null, is_founding: true, created_at: new Date() },
      { id: crypto.randomUUID(), code: 'ACP', name: 'Aam Cockroach Party',       color: '#1D9E75', tagline: 'Naali Sabki, Iss Baar Cockroach Ki', logo_url: null, founder_fingerprint: null, is_founding: true, created_at: new Date() },
      { id: crypto.randomUUID(), code: 'RCP', name: 'Regional Cockroach Party',  color: '#D4537E', tagline: 'Apni Galli Apna Kachra',              logo_url: null, founder_fingerprint: null, is_founding: true, created_at: new Date() },
    ]
    const partyOps = partyDocs.map(p => ({
      updateOne: { filter: { code: p.code }, update: { $setOnInsert: p }, upsert: true },
    }))
    await partiesCol.bulkWrite(partyOps, { ordered: false })
    console.log(`✓ ${partyDocs.length} founding parties seeded`)

    // ── 3. Cycle 1 ────────────────────────────────────────────────────────
    const cyclesCol = db.collection('cycles')
    await cyclesCol.createIndex({ cycle_number: 1 }, { unique: true })

    const cycle = {
      id: crypto.randomUUID(),
      cycle_number: 1,
      starts_at: new Date('2026-05-20T00:00:00+05:30'),
      snapshot_at: new Date('2026-06-06T23:00:00+05:30'),
      ends_at: new Date('2026-06-07T00:00:00+05:30'),
      status: 'live' as const,
      created_at: new Date(),
    }
    await cyclesCol.updateOne(
      { cycle_number: 1 },
      { $setOnInsert: cycle },
      { upsert: true }
    )
    console.log('✓ Cycle 1 seeded (snapshot: June 6 2026 23:00 IST)')

    // ── Indexes ───────────────────────────────────────────────────────────
    const candidatesCol = db.collection('candidates')
    await candidatesCol.createIndex({ id: 1 }, { unique: true })
    await candidatesCol.createIndex({ seat_number: 1, withdrawn: 1 })
    await candidatesCol.createIndex({ filer_fingerprint: 1, created_at: 1 })
    await candidatesCol.createIndex({ display_name: 'text' })

    const votesCol = db.collection('votes')
    await votesCol.createIndex({ candidate_id: 1 })
    await votesCol.createIndex({ seat_number: 1, cycle_id: 1 })
    await votesCol.createIndex({ voter_fingerprint: 1, seat_number: 1, cycle_id: 1 })

    const soulsCol = db.collection('souls')
    await soulsCol.createIndex({ fingerprint: 1 }, { unique: true })
    console.log('✓ All indexes created')

    // ── Smoke test ────────────────────────────────────────────────────────
    const [sc, pc, cc] = await Promise.all([
      seatsCol.countDocuments(),
      partiesCol.countDocuments(),
      cyclesCol.countDocuments(),
    ])
    console.log('\n--- Smoke Test ---')
    console.log(`seats:   ${sc} ${sc >= 543 ? '✓' : '✗ (expected 543)'}`)
    console.log(`parties: ${pc} ${pc >= 4 ? '✓' : '✗ (expected 4)'}`)
    console.log(`cycles:  ${cc} ${cc >= 1 ? '✓' : '✗ (expected 1)'}`)
    if (sc < 543 || pc < 4 || cc < 1) process.exit(1)
    console.log('\n✓ All checks passed. MongoDB Atlas is ready.')
  } finally {
    await client.close()
  }
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})
