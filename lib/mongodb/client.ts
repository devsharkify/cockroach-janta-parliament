import { MongoClient, ServerApiVersion } from 'mongodb'

const uri = process.env.MONGODB_URI ?? ''

if (!uri && process.env.NODE_ENV !== 'test') {
  // silent — mock mode when no URI
}

let clientPromise: Promise<MongoClient>

if (!uri) {
  // No URI — return a dummy promise that never resolves (mock mode handled per-route)
  clientPromise = new Promise(() => {})
} else if (process.env.NODE_ENV === 'development') {
  const g = global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> }
  if (!g._mongoClientPromise) {
    const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true } })
    g._mongoClientPromise = client.connect()
  }
  clientPromise = g._mongoClientPromise
} else {
  const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true } })
  clientPromise = client.connect()
}

export default clientPromise
