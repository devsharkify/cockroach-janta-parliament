/**
 * Seeds the seats collection from /data/lok_sabha_seats_543.csv
 * Run: npx tsx scripts/seed-seats.ts
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

const csvPath = resolve(process.cwd(), 'data/lok_sabha_seats_543.csv')
const raw = readFileSync(csvPath, 'utf-8')
const lines = raw.trim().split('\n')

const seatDocs = lines.slice(1).map(line => {
  const values = line.split(',')
  return {
    number: parseInt(values[0], 10),
    slug: values[1],
    name: values[2],
    state: values[3],
    state_code: values[4],
  }
})

async function main() {
  const client = new MongoClient(uri!)
  try {
    await client.connect()
    const db = client.db(process.env.MONGODB_DB ?? 'cockroach_parliament')
    const col = db.collection('seats')

    // Ensure unique index on number
    await col.createIndex({ number: 1 }, { unique: true })

    console.log(`Seeding ${seatDocs.length} seats...`)

    const ops = seatDocs.map(s => ({
      updateOne: {
        filter: { number: s.number },
        update: { $set: s },
        upsert: true,
      },
    }))

    const result = await col.bulkWrite(ops, { ordered: false })
    console.log(`✓ ${result.upsertedCount} inserted, ${result.modifiedCount} updated`)

    const count = await col.countDocuments()
    console.log(`✓ Seats collection count: ${count}`)
    if (count !== 543) console.warn(`⚠ Expected 543, got ${count}`)
  } finally {
    await client.close()
  }
}

main().catch(err => {
  console.error(err.message)
  process.exit(1)
})
