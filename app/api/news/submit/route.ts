import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb/client'

const J_ADJ = [
  'Viral', 'Breaking', 'Exclusive', 'Drainage', 'Galli',
  'Sarkari', 'Underground', 'Bawaal', 'Desi', 'Naali',
  'Jugaad', 'Bindaas', 'Kachra', 'Trending', 'Supreme',
]
const J_NOUN = [
  'Singh', 'Kumar', 'Sharma', 'Verma', 'Gupta',
  'Lal', 'Rao', 'Mishra', 'Khan', 'Das',
  'Nair', 'Pillai', 'Joshi', 'Tiwari', 'Iyer',
]
const J_ROLES = [
  'Chief Drain Correspondent, CJTV',
  'Political Affairs Reporter, CJTV',
  'Senior Naali Analyst, CJTV',
  'Breaking News Editor, CJTV',
  'Viral Affairs Correspondent, CJTV',
  'Field Reporter (Drains & Cockroaches), CJTV',
  'Senior Investigative Roach, CJTV',
  'Parliamentary Correspondent, CJTV',
  'Bribe Beat Reporter, CJTV',
  'Election Commission Watcher, CJTV',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const headline: string = (body.headline ?? '').trim()
    const reportBody: string = (body.body ?? '').trim()
    // Client can pass a pre-generated author name — use it, or generate fresh
    const authorName: string = (body.authorName ?? '').trim() || `${pick(J_ADJ)}_${pick(J_NOUN)}`
    const authorRole: string = (body.authorRole ?? '').trim() || pick(J_ROLES)

    if (!headline || !reportBody) {
      return NextResponse.json({ error: 'Headline and body are required.' }, { status: 400 })
    }
    if (headline.length > 200) {
      return NextResponse.json({ error: 'Headline exceeds 200 characters.' }, { status: 400 })
    }
    if (reportBody.length > 1000) {
      return NextResponse.json({ error: 'Body exceeds 1000 characters.' }, { status: 400 })
    }

    const article = {
      headline,
      body: reportBody,
      author: authorName,
      authorRole,
      publishedAt: new Date().toISOString(),
      createdAt: new Date(),
      source: 'user',
    }

    // Persist to MongoDB if available, silently skip if not (mock mode)
    if (process.env.MONGODB_URI) {
      try {
        const client = await clientPromise
        const db = client.db('cockroach_parliament')
        await db.collection('user_articles').insertOne({ ...article })
      } catch (dbErr) {
        console.error('[news/submit] DB write failed:', dbErr)
        // Still return success — article is "ephemeral" without DB
      }
    }

    return NextResponse.json({ success: true, article })
  } catch (err) {
    console.error('[news/submit]', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

/* GET — fetch recent user-submitted articles */
export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ articles: [] })
    }
    const client = await clientPromise
    const db = client.db('cockroach_parliament')
    const articles = await db
      .collection('user_articles')
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()
    return NextResponse.json({
      articles: articles.map(a => ({
        headline: a.headline,
        body: a.body,
        author: a.author,
        authorRole: a.authorRole,
        publishedAt: a.publishedAt,
      })),
    })
  } catch (err) {
    console.error('[news/submit GET]', err)
    return NextResponse.json({ articles: [] })
  }
}
