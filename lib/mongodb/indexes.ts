import clientPromise from './client'

export async function ensureIndexes() {
  if (!process.env.MONGODB_URI) return
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB ?? 'cockroach_parliament')

    await Promise.all([
      db.collection('seats').createIndex({ number: 1 }, { unique: true }),
      db.collection('parties').createIndex({ code: 1 }, { unique: true }),
      db.collection('parties').createIndex({ id: 1 }, { unique: true }),
      db.collection('cycles').createIndex({ cycle_number: 1 }, { unique: true }),
      db.collection('cycles').createIndex({ status: 1 }),
      db.collection('candidates').createIndex({ id: 1 }, { unique: true }),
      db.collection('candidates').createIndex({ seat_number: 1, withdrawn: 1 }),
      db.collection('candidates').createIndex({ filer_fingerprint: 1, created_at: -1 }),
      db.collection('candidates').createIndex({ display_name: 'text' }),
      db.collection('candidates').createIndex({ party_id: 1 }),
      db.collection('votes').createIndex({ candidate_id: 1 }),
      db.collection('votes').createIndex({ seat_number: 1, cycle_id: 1 }),
      db.collection('votes').createIndex({ voter_fingerprint: 1, seat_number: 1, cycle_id: 1 }),
      db.collection('votes').createIndex({ created_at: -1 }),
      db.collection('souls').createIndex({ fingerprint: 1 }, { unique: true }),
      db.collection('results').createIndex({ cycle_id: 1, seat_number: 1 }, { unique: true }),
    ])
    console.log('✓ MongoDB indexes ensured')
  } catch (err) {
    console.error('Index creation error:', err)
  }
}
