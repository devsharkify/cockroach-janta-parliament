import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

const FALLBACKS = [
  'Naali meri, vote tera.\nKachra saaf, future bright.\nCockroach power, hum laayenge.\nVote karo, change aayega.',
  'Main hun aam cockroach ka neta.\nGalli galli mein meri awaaz.\nBhooka raha, lekin lada.\nAb seat chahiye, vote do.',
  'Naali se nikla, palace jaaunga.\nMacchar bhi darega mujhse.\nManifesto simple: Survive karein.\nCockroach Janta Zindabad.',
  'Yeh seat meri hai, history dekhega.\nMain aaya, main jeeta, main loot ke gaya.\nJust kidding — main hon naali ka sachcha sevak.\nVote karo, kuch nahi badlega. Or will it?',
  'Char lines mein kya bataaun.\nZindagi bhar naali mein raha.\nAb naali ko parliament mein launga.\nBas ek vote chahiye, theek hai?',
]

// POST /api/manifesto/generate
// Body: { name: string, seat: string, state: string, party: string }
// Returns: { manifesto: string }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { name = 'Unknown Roach', seat = 'Some Seat', state = 'India', party = 'Independent' } = body

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ manifesto: FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)] })
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: `You are writing a 4-line satirical election manifesto for a cockroach-themed fictional political platform called "Cockroach Janta Parliament". This is pure satire — not a real election.

Candidate name: ${name}
Constituency: ${seat}, ${state}
Party: ${party}

Write exactly 4 short lines (each under 15 words) that form a manifesto. Mix Hindi and English (Hinglish). Tone: absurdist, funny, self-aware, meme-y. Reference naali (gutter), kachra (garbage), cockroaches, or local flavor. Do NOT mention real politicians, real parties, or real religion. Do NOT be offensive. Output ONLY the 4 lines, nothing else.`,
        },
      ],
    })

    const manifesto = (message.content[0] as { type: string; text: string }).text.trim()
    return Response.json({ manifesto })
  } catch {
    return Response.json({ manifesto: FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)] })
  }
}
