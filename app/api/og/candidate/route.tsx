import { NextRequest } from 'next/server'

// GET /api/og/candidate?name=...&seat=...&party=...&color=...&manifesto=...
// Returns an SVG image (1080x1920) suitable for IG story share
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const name = searchParams.get('name') ?? 'Unknown Roach'
  const seat = searchParams.get('seat') ?? 'Unknown Seat'
  const party = searchParams.get('party') ?? 'Independent'
  const color = searchParams.get('color') ?? '#7F77DD'
  const manifesto = searchParams.get('manifesto') ?? ''

  const lines = manifesto.split('\n').slice(0, 4)

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3C3489"/>
      <stop offset="100%" stop-color="#1A1060"/>
    </linearGradient>
    <style>
      text { font-family: 'Arial Black', Arial, sans-serif; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1920" fill="url(#bg)"/>

  <!-- Gold border -->
  <rect x="30" y="30" width="1020" height="1860" rx="24" fill="none" stroke="#D4A017" stroke-width="6"/>

  <!-- Party color bar top -->
  <rect x="30" y="30" width="1020" height="180" rx="24" fill="${color}"/>
  <rect x="30" y="150" width="1020" height="60" fill="${color}"/>

  <!-- Party code -->
  <text x="540" y="155" text-anchor="middle" fill="white" font-size="80" font-weight="900">${party}</text>

  <!-- Cockroach emoji area -->
  <text x="540" y="400" text-anchor="middle" font-size="200">🪳</text>

  <!-- "I'M CONTESTING FROM" -->
  <text x="540" y="560" text-anchor="middle" fill="#D4A017" font-size="48" font-weight="700" letter-spacing="4">I'M CONTESTING FROM</text>

  <!-- Seat name -->
  <text x="540" y="660" text-anchor="middle" fill="white" font-size="72" font-weight="900">${escapeXml(seat.toUpperCase())}</text>

  <!-- Divider -->
  <line x1="120" y1="710" x2="960" y2="710" stroke="#D4A017" stroke-width="3" opacity="0.6"/>

  <!-- Candidate name -->
  <text x="540" y="810" text-anchor="middle" fill="white" font-size="64" font-weight="900">${escapeXml(name)}</text>

  <!-- Manifesto label -->
  <text x="120" y="900" fill="#D4A017" font-size="36" font-weight="700" letter-spacing="3">MANIFESTO</text>

  <!-- Manifesto lines -->
  ${lines.map((line, i) => `<text x="120" y="${970 + i * 80}" fill="white" font-size="44" font-weight="500" opacity="0.9">${escapeXml(line)}</text>`).join('\n  ')}

  <!-- Divider -->
  <line x1="120" y1="1320" x2="960" y2="1320" stroke="#D4A017" stroke-width="3" opacity="0.6"/>

  <!-- CTA -->
  <text x="540" y="1410" text-anchor="middle" fill="#D4A017" font-size="40" font-weight="700">Vote at</text>
  <text x="540" y="1470" text-anchor="middle" fill="white" font-size="52" font-weight="900">cockroachparliament.in</text>

  <!-- Hashtags -->
  <text x="540" y="1600" text-anchor="middle" fill="white" font-size="36" opacity="0.6">#CockroachJantaParliament</text>
  <text x="540" y="1650" text-anchor="middle" fill="white" font-size="36" opacity="0.6">#MainBhiCockroach</text>

  <!-- Satire disclaimer -->
  <text x="540" y="1850" text-anchor="middle" fill="white" font-size="24" opacity="0.4">Satirical platform. Not affiliated with ECI.</text>
</svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
