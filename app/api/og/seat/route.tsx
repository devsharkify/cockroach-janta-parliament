import { NextRequest } from 'next/server'

// GET /api/og/seat?seat=NAME&num=485&state=UP&candidates=3&votes=1234
// Returns an SVG image (1200×630) for Twitter/OG card — seat overview card.
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const seatName = searchParams.get('seat') ?? 'Unknown Seat'
  const num = searchParams.get('num') ?? '?'
  const state = searchParams.get('state') ?? 'India'
  const candidates = searchParams.get('candidates') ?? '0'
  const votes = searchParams.get('votes') ?? '0'

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f0b30"/>
        <stop offset="100%" stop-color="#1a1060"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect x="0" y="0" width="1200" height="8" fill="#D4A017"/>
    <rect x="0" y="622" width="1200" height="8" fill="#D4A017"/>
    <text x="60" y="120" fill="#D4A017" font-size="28" font-family="Arial Black, Arial" font-weight="900" letter-spacing="4">COCKROACH JANTA PARLIAMENT</text>
    <text x="60" y="80" font-size="60" font-family="Arial">🪳</text>
    <text x="60" y="260" fill="white" font-size="80" font-family="Arial Black, Arial" font-weight="900">${escapeXml(seatName.toUpperCase())}</text>
    <text x="60" y="320" fill="#D4A017" font-size="36" font-family="Arial Black, Arial">SEAT #${num} · ${escapeXml(state.toUpperCase())}</text>
    <line x1="60" y1="360" x2="1140" y2="360" stroke="#D4A017" stroke-width="2" opacity="0.4"/>
    <text x="60" y="430" fill="white" font-size="48" font-family="Arial Black, Arial" font-weight="900">${candidates} CANDIDATES</text>
    <text x="400" y="430" fill="white" font-size="48" font-family="Arial Black, Arial" font-weight="900">${parseInt(votes).toLocaleString()} VOTES</text>
    <text x="60" y="550" fill="white" font-size="32" font-family="Arial" opacity="0.6">cockroachparliament.in/seat/${num}</text>
    <text x="1140" y="550" text-anchor="end" fill="white" font-size="24" font-family="Arial" opacity="0.4">Satirical platform. Not affiliated with ECI.</text>
  </svg>`

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=3600' },
  })
}

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
